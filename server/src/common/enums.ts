export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  CNY = 'CNY',
}

export enum Unit {
  // Unit for vegetable
  GRAM = 'GRAM',
  KILOGRAM = 'KILOGRAM',
  // Unit for bread
  PIECE = 'PIECE',
  LOAF = 'LOAF',
  // Unit for beer
  BOTTLE = 'BOTTLE',
  CAN = 'CAN',
  PACK = 'PACK',
}

export enum ItemType {
  BREAD = 'BREAD',
  VEGETABLE = 'VEGETABLE',
  BEER = 'BEER',
}

export enum Country {
  NL = 'NL', //Netherlands
  BE = 'BE', //Belgium
  DE = 'DE', //Germany
}

export const BEER_UNITS = [Unit.BOTTLE, Unit.CAN, Unit.PACK];
export const VEGETABLE_UNITS = [Unit.GRAM, Unit.KILOGRAM];
export const BREAD_UNITS = [Unit.PIECE, Unit.LOAF];

export const UNIT_ONLY_ALLOWED_INTEGER = [
  Unit.BOTTLE,
  Unit.CAN,
  Unit.PACK,
  Unit.LOAF,
  Unit.PIECE,
];

export const ITEM_ONLY_ALLOWED_INTEGER = [ItemType.BEER, ItemType.BREAD];
