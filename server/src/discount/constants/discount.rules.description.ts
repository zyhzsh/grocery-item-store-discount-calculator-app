export const EU_BEER_DISCOUNT_RULE = {
  rules: [
    'Discounts are only applicable in EUR.',
    'Discounts apply only when beer is bought in packs of 6.',
    'Buying 6 separate bottles/cans of the same beer is the same as buying one pack of the same beer.',
    '€3.00 for each Belgium beer pack.',
    '€2,00 for each Dutch beer pack',
    '€4,00 for each German beer pack ',
  ],
};
export const BREAD_DISCOUNT_RULE = {
  rules: [
    'Bread older than 6 days cannot be added to an order.',
    'Discounts based on bread age:',
    '1 day old or newer: no discount.',
    `3 days old: 'buy 1 get 2' discount.`,
    "6 days old: 'pay 1 get 3' discount.",
  ],
};

export const VEGETABLE_DISCOUNT_RULE = {
  rules: [
    'Discounts are percentage-based depending on the weight.',
    'Applied to all vegetable items in the same order.',
    'This rule only applies to items measured in grams or kilograms (e.g., canned corn and other similar products are not included in these rules).',
    '0g~100g: 5% discount',
    '100g~500g: 7% discount',
    'More than 500g: 10% discount',
  ],
};
