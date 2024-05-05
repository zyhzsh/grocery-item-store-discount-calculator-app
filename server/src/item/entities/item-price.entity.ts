import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Currency, Unit } from 'src/common/enums';
import { Max, Min } from 'class-validator';

@Entity()
export class ItemPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @Column({
    type: 'enum',
    enum: Unit,
  })
  unit: Unit;

  @Min(0.01)
  @Max(50000)
  @Column('numeric')
  value: number;

  @ManyToOne(() => Item, (item) => item.prices, {
    onDelete: 'CASCADE',
  })
  item: Item;
}
