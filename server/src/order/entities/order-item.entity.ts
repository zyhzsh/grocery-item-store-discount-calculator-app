import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Max, Min } from 'class-validator';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  itemId: string;

  @Column('uuid')
  priceId: string;

  @Min(0.001)
  @Max(20000)
  @Column('numeric')
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
