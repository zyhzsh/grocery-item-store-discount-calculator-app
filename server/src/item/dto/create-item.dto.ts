import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  Max,
  MaxDate,
  Min,
  ValidateNested,
} from 'class-validator';
import { UNIT_PRICE_RANGE } from 'src/common/constants/variable.range';
import { Country, Currency, ItemType, Unit } from 'src/common/enums';

export class CreateItemDto {
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

  @IsNotEmpty()
  @IsEnum(Country)
  brandOriginCountry: Country;

  @Type(() => Date)
  @MaxDate(() => new Date())
  productionDate: Date;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPriceDto)
  prices: ItemPriceDto[];
}
export class ItemPriceDto {
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
