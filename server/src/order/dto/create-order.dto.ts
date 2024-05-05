import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from 'src/common/enums';
import { QUANTITY_RANGE } from 'src/common/constants/variable.range';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  @IsUUID()
  @IsDefined()
  itemId: string;

  @IsUUID()
  @IsDefined()
  priceId: string;

  @IsNumber()
  @Min(QUANTITY_RANGE.min)
  @Max(QUANTITY_RANGE.max)
  quantity: number;
}
