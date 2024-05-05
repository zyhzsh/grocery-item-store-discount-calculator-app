import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { UNIT_PRICE_RANGE } from 'src/common/constants/variable.range';
import { Currency, Unit } from 'src/common/enums';

export class CreateItemPriceDto {
  @IsUUID()
  @IsDefined()
  itemId: string;

  @IsNotEmpty()
  @IsEnum(Unit)
  unit: Unit;

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  @Min(UNIT_PRICE_RANGE.min)
  @Max(UNIT_PRICE_RANGE.max)
  value: number;
}
