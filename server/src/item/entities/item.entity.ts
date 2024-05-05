import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemPrice } from './item-price.entity';
import { Country, ItemType } from 'src/common/enums';
import {
  ArrayMinSize,
  IsDate,
  IsString,
  Length,
  Matches,
  MaxDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @Length(2, 50, {
    message: 'Name must be between 2 and 50 characters long.',
  })
  @Matches(/^[a-zA-Z0-9 ]+$/, {
    message: 'Name can only contain alphanumeric characters and spaces.',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: ItemType,
  })
  type: ItemType;

  @OneToMany(() => ItemPrice, (itemPrice) => itemPrice.item, { cascade: true })
  @ArrayMinSize(1, {
    message: 'Each item must have at least one price.',
  })
  @ValidateNested({ each: true })
  @Type(() => ItemPrice)
  prices: ItemPrice[];

  @Column()
  @IsDate()
  @MaxDate(new Date(), {
    message: 'Production date cannot be in the future.',
  })
  productionDate: Date;

  @Column({
    type: 'enum',
    enum: Country,
  })
  brandOriginCountry: Country;
}
