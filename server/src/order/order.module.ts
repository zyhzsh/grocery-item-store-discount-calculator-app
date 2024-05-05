import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ItemModule } from 'src/item/item.module';
import { DiscountModule } from '../discount/discount.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [
    ItemModule,
    DiscountModule,
    TypeOrmModule.forFeature([Order, OrderItem, Item, OrderItem]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
