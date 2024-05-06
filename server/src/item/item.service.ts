import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

import { CreateItemPriceDto } from './dto/create-item-price.dto';
import { ItemPrice } from './entities/item-price.entity';
import {
  BEER_UNITS,
  BREAD_UNITS,
  ITEM_ONLY_ALLOWED_INTEGER,
  ItemType,
  UNIT_ONLY_ALLOWED_INTEGER,
  Unit,
  VEGETABLE_UNITS,
} from 'src/common/enums';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemPrice)
    private readonly itemPriceRepository: Repository<ItemPrice>,
  ) {}

  async deletePrice(priceId: string): Promise<void> {
    // Find the ItemPrice and its associated Item
    const price = await this.itemPriceRepository.findOne({
      where: { id: priceId },
      relations: ['item'],
    });

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    // Load the item with its prices to check the number of associated prices
    const item = await this.itemRepository.findOne({
      where: { id: price.item.id },
      relations: ['prices'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Check if it's the last price
    if (item.prices.length <= 1) {
      throw new NotAcceptableException(
        'Cannot delete the last price of an item.',
      );
    }

    // If not the last price, delete the price
    await this.itemPriceRepository.delete(priceId);
  }

  async deleteItem(itemId: string): Promise<void> {
    try {
      await this.itemRepository.delete(itemId);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find({ relations: ['prices'] });
  }

  async createItem(createItemDto: CreateItemDto): Promise<Item> {
    if (createItemDto.prices.length === 0) throw new NotAcceptableException();
    try {
      const { type, prices } = createItemDto;
      for (const price of prices) {
        const result = this.validateUnitAndProductTypeIsLegit(type, price.unit);
        if (!result)
          throw new BadRequestException(
            'Invalid type: ' + type,
            'and' + price.unit,
          );
      }
      const newItem = this.itemRepository.create(createItemDto);
      return await this.itemRepository.save(newItem);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findItem(itemId: string): Promise<Item> {
    const item = this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['prices'],
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async updateItemUnitPrice(priceId: string, value: number): Promise<void> {
    try {
      await this.itemPriceRepository.update(
        {
          id: priceId,
        },
        {
          value,
        },
      );
    } catch (err) {
      throw new InternalServerErrorException('Entity save failed.');
    }
  }

  async createItemPrice(newPrice: CreateItemPriceDto): Promise<ItemPrice> {
    const { itemId, unit, currency, value } = newPrice;

    //If not found, the item, terminate creation
    const item = await this.findItem(itemId);
    if (!item) throw new NotAcceptableException('Item or Price does not valid');

    // Get Item's prices, to check the duplication (if the unit and the unit price are the same, then should update the unit price)
    const { prices } = item;
    const duplicatedPrice = prices.find(
      (item) => item.unit == unit && item.currency == currency,
    );

    //If is duplicated then update unitprice
    if (duplicatedPrice) {
      await this.updateItemUnitPrice(duplicatedPrice.id, value);

      return { ...duplicatedPrice, value };
    }

    // Check the creation is make sense
    const validationResult = this.validateUnitAndProductTypeIsLegit(
      item.type,
      unit,
    );

    if (!validationResult)
      throw new BadRequestException(
        'Unit , product type and qunitity/weight, are not legit !',
      );

    // Otherwise create new price the the item
    try {
      const newPrice = await this.itemPriceRepository.create({
        item,
        unit,
        currency,
        value,
      });
      return await this.itemPriceRepository.save(newPrice);
    } catch (err) {
      throw new InternalServerErrorException('Entity save failed.');
    }
  }

  public validateUnitAndProductTypeIsLegit(
    type: ItemType,
    unit: Unit,
  ): boolean {
    switch (type) {
      case ItemType.BEER:
        return BEER_UNITS.includes(unit);
      case ItemType.BREAD:
        return BREAD_UNITS.includes(unit);
      case ItemType.VEGETABLE:
        return VEGETABLE_UNITS.includes(unit);
    }
  }
  public validateQuantityAndProductTypeIsLegit(
    type: ItemType,
    quantity: number,
  ): boolean {
    const isInteger = Number.isInteger(quantity);
    const isOnlyAllowedInteger = ITEM_ONLY_ALLOWED_INTEGER.includes(type);
    // If the type requires an integer, verify the quantity is an integer
    if (isOnlyAllowedInteger && !isInteger) {
      return false;
    }
    // If the type does not require an integer or if the quantity is an integer, return true
    return true;
  }

  public validateUnitAndQuantityIsLegit(unit: Unit, quantity: number): boolean {
    const isInteger = Number.isInteger(quantity);
    const isOnlyAllowedInteger = UNIT_ONLY_ALLOWED_INTEGER.includes(unit);
    // If the unit requires an integer, verify the quantity is an integer
    if (isOnlyAllowedInteger && !isInteger) {
      return false;
    }
    // If the unit does not require an integer or if the quantity is an integer, return true
    return true;
  }
}
