import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxDate,
  Min,
  ValidateNested,
} from 'class-validator';
import { Country, Currency, ItemType, Unit } from 'src/common/enums';
import { QUANTITY_RANGE, UNIT_PRICE_RANGE } from '../constants/variable.range';

export class GeneratedReceiptDto {
  @IsUUID()
  @IsDefined()
  orderId: string;

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  discount: number;

  @IsNumber()
  beforeDiscountTotal: number;

  @IsNumber()
  total: number;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GeneratedReceiptItemDto)
  receiptItems: GeneratedReceiptItemDto[];
}

export class GeneratedReceiptItemDto {
  @IsUUID()
  @IsDefined()
  itemId: string;

  @IsString()
  @Length(2, 50, {
    message: 'Name must be between 2 and 50 characters long.',
  })
  @Matches(/^[a-zA-Z0-9 ]+$/, {
    message: 'Name can only contain alphanumeric characters and spaces.',
  })
  name: string;

  @IsNotEmpty()
  @IsEnum(ItemType)
  type: ItemType;

  @IsNumber()
  @Min(QUANTITY_RANGE.min)
  @Max(QUANTITY_RANGE.max)
  quantity: number;

  @Type(() => Date)
  @MaxDate(() => new Date())
  productionDate: Date;

  @IsNumber()
  @Min(UNIT_PRICE_RANGE.min)
  @Max(UNIT_PRICE_RANGE.max)
  unitPrice: number;

  @IsNotEmpty()
  @IsEnum(Unit)
  unit: Unit;

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsNotEmpty()
  @IsEnum(Country)
  brandOriginCountry: Country;
}
