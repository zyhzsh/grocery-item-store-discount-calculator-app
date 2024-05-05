import { BadRequestException, Injectable } from '@nestjs/common';
import { DiscountService } from '../discount/discount.service';
import { ItemService } from '../item/item.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { Item } from '../item/entities/item.entity';
import {
  GeneratedReceiptDto,
  GeneratedReceiptItemDto,
} from '../common/dto/generated-receipt.dto';
import { ItemPrice } from '../item/entities/item-price.entity';
import { Currency, ItemType } from '../common/enums';

@Injectable()
export class OrderService {
  constructor(
    private readonly discountService: DiscountService,
    private readonly itemService: ItemService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['orderItems'] });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { currency, items } = createOrderDto;

    // Merge the items that if itemId and priceId are the same, then add the quantity
    const mergedItems = await this.mergeDuplicateOrderItems(items);
    //Verify that the order is valid
    const validatedResult = await this.validateOrderItemsIsLegit(
      currency,
      mergedItems,
    );
    if (!validatedResult) {
      throw new BadRequestException('Item or Price does not valid');
    }
    const newOrder = this.orderRepository.create({
      currency,
      orderItems: mergedItems,
    });
    await this.orderRepository.save(newOrder);
    return this.generateReceipt(newOrder);
  }

  private async mergeDuplicateOrderItems(
    items: CreateOrderItemDto[],
  ): Promise<CreateOrderItemDto[]> {
    const mergedItems = [];

    // Iterate over each item in the order
    await items.forEach((currentItem) => {
      let isItemAlreadyAdded = false;

      // Check if the current item is already in the mergedItems array
      for (let i = 0; i < mergedItems.length; i++) {
        const existingItem = mergedItems[i];

        if (
          existingItem.itemId === currentItem.itemId &&
          existingItem.priceId === currentItem.priceId
        ) {
          // If the item is already in the array, increase its quantity
          existingItem.quantity += currentItem.quantity;
          isItemAlreadyAdded = true;
          break;
        }
      }

      // If the item is not in the array, add it
      if (!isItemAlreadyAdded) {
        mergedItems.push({ ...currentItem });
      }
    });

    return mergedItems;
  }

  private async generateReceipt(order: Order): Promise<GeneratedReceiptDto> {
    const receipt: GeneratedReceiptDto = {
      orderId: order.id,
      currency: order.currency,
      receiptItems: [],
      discount: 0,
      beforeDiscountTotal: 0,
      total: 0,
    };

    for (const orderItem of order.orderItems) {
      const { quantity } = orderItem;
      const item: Item = await this.itemService.findItem(orderItem.itemId);
      const price: ItemPrice = item.prices.find(
        (p) => p.id === orderItem.priceId,
      );
      if (!price) {
        throw new BadRequestException('Price not found for item');
      }
      const receiptItem: GeneratedReceiptItemDto = {
        itemId: item.id,
        name: item.name,
        type: item.type,
        quantity: quantity,
        productionDate: item.productionDate,
        unitPrice: price.value,
        unit: price.unit,
        currency: price.currency,
        brandOriginCountry: item.brandOriginCountry,
      };
      receipt.beforeDiscountTotal += receiptItem.unitPrice * quantity;
      receipt.receiptItems.push(receiptItem);
    }
    const discountTotal: number = await this.discountService.calculateDiscount(
      receipt.receiptItems,
    );
    receipt.discount = discountTotal;
    receipt.total = receipt.beforeDiscountTotal - receipt.discount;
    return receipt;
  }

  private async validateOrderItemsIsLegit(
    currency: Currency,
    orderItems: CreateOrderItemDto[],
  ): Promise<boolean> {
    //Step 1: Find the all entries
    const itemIds = [];
    const priceIds = [];
    for (const orderItem of orderItems) {
      itemIds.push(orderItem.itemId);
      priceIds.push(orderItem.priceId);
    }
    const items = await this.itemRepository.find({
      where: { id: In(itemIds), prices: { currency, id: In(priceIds) } },
    });

    //Step 2: Evaluate, if the there are different currency in the same order, then return false
    if (items.length !== orderItems.length) return false;

    items.forEach((item) => {
      //Step 3: Check if order contains bread, and check every bread if the productionDate is more than 6 days ago, return false
      if (item.type === ItemType.BREAD) {
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        if (item.productionDate <= sixDaysAgo) {
          return false;
        }
      }
      for (const orderItem of orderItems) {
        if (item.id === orderItem.itemId) {
          //Step 4: Check if product type (unit) and quantity is matching
          const result = this.itemService.validateQuantityAndProductTypeIsLegit(
            item.type,
            orderItem.quantity,
          );
          if (!result) return false;
        }
      }
    });
    return true;
  }
}
