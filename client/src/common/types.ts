import { Country, Currency, ItemType, Unit } from './enums';

export type Item = {
  id: string;
  name: string;
  type: ItemType;
  productionDate: string;
  brandOriginCountry: Country;
  prices: ItemPrice[];
};

export type ItemPrice = {
  id?: string;
  currency?: Currency;
  unit?: Unit;
  value?: number;
};

export type CreateItemDto = {
  name: string;
  type: ItemType;
  brandOriginCountry: Country;
  productionDate: string;
  prices: ItemPriceDto[];
};

export type ItemPriceDto = {
  unit: Unit;
  currency: Currency;
  value: number;
};

export type OrderItem = {
  item: Item;
  price: ItemPrice;
  quantity: number;
  currency: Currency;
};

export type CalculateResult = {
  currency: Currency | string;
  discount: number;
  beforeDiscountTotal: number;
  total: number;
};
