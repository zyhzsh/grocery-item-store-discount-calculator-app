import { Country, Currency, ItemType, Unit } from 'src/common/enums';
import { BreadDiscountStrategy } from './bread-discount.strategy';

describe('BreadDiscountStrategy', () => {
  const breadDiscountStrategy = new BreadDiscountStrategy();

  describe('getRules', () => {
    it('returns the discount rule description', () => {
      const rules = breadDiscountStrategy.getRules();
      expect(rules).not.toBeNull();
    });
  });

  describe('calculateDiscount', () => {
    it('returns 0 when no items are provided', () => {
      const items = [];
      expect(breadDiscountStrategy.calculateDiscount(items)).toBe(0);
    });
    it('returns 0 when no bread items are present', () => {
      const items = [
        {
          itemId: '1',
          name: 'Not a beer',
          type: ItemType.BREAD,
          quantity: 1,
          productionDate: new Date(),
          unitPrice: 10,
          unit: Unit.PACK,
          currency: Currency.EUR,
          brandOriginCountry: Country.NL,
        },
      ];
      expect(breadDiscountStrategy.calculateDiscount(items)).toBe(0);
    });
    const unitPrices = { price1: 10, price2: 1.5, price3: 1.34 };
    const quantities = { quantity1: 3, quantity2: 4, quantity3: 1 };
    describe('one bread on list', () => {
      const testCases = [
        {
          age: 3,
          unitPrice: unitPrices['price1'],
          quantity: quantities['quantity1'],
          expectedDiscount: 10,
        },
        {
          age: 3,
          unitPrice: unitPrices['price2'],
          quantity: quantities['quantity1'],
          expectedDiscount: 1.5,
        },
        {
          age: 3,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 1.34,
        },
        {
          age: 6,
          unitPrice: unitPrices['price1'],
          quantity: quantities['quantity2'],
          expectedDiscount: 20,
        },
        { age: 0, unitPrice: 10, quantity: 1, expectedDiscount: 0 },
        { age: 1, unitPrice: 10, quantity: 1, expectedDiscount: 0 },
      ];

      testCases.forEach(({ age, unitPrice, quantity, expectedDiscount }) => {
        it(`returns correct discount for a ${age} days old bread when unit price = ${unitPrice}, quantity = ${quantity}`, () => {
          const items = [
            {
              itemId: '1',
              name: 'Bread',
              type: ItemType.BREAD,
              quantity: quantity,
              productionDate: new Date(Date.now() - age * 24 * 60 * 60 * 1000), // age days old
              unitPrice: unitPrice,
              unit: Unit.LOAF,
              currency: Currency.EUR,
              brandOriginCountry: Country.NL,
            },
          ];
          expect(breadDiscountStrategy.calculateDiscount(items)).toBe(
            expectedDiscount,
          );
        });
      });
    });
    describe('mutiple breads on list', () => {
      const testCases = [
        {
          bread1: {
            age: 3,
            unitPrice: unitPrices['price1'],
            quantity: quantities['quantity1'],
          },
          bread2: {
            age: 6,
            unitPrice: unitPrices['price1'],
            quantity: quantities['quantity2'],
          },
          expectedDiscount: 30,
        },
        {
          bread1: { age: 3, unitPrice: unitPrices['price1'], quantity: 3 },
          bread2: { age: 6, unitPrice: unitPrices['price2'], quantity: 4 },
          expectedDiscount: 13,
        },
        {
          bread1: { age: 3, unitPrice: unitPrices['price1'], quantity: 3 },
          bread2: { age: 6, unitPrice: unitPrices['price3'], quantity: 4 },
          expectedDiscount: 12.68,
        },
      ];

      testCases.forEach(({ bread1, bread2, expectedDiscount }) => {
        it(`returns correct discount for a ${bread1.age} days old bread (unit price = ${bread1.unitPrice}, quantity = ${bread1.quantity}) and a ${bread2.age} days old bread (unit price = ${bread2.unitPrice}, quantity=${bread2.quantity}`, () => {
          const items = [
            {
              itemId: '1',
              name: 'Bread 1',
              type: ItemType.BREAD,
              quantity: bread1.quantity,
              productionDate: new Date(
                Date.now() - bread1.age * 24 * 60 * 60 * 1000,
              ), // age days old
              unitPrice: bread1.unitPrice,
              unit: Unit.LOAF,
              currency: Currency.EUR,
              brandOriginCountry: Country.NL,
            },
            {
              itemId: '2',
              name: 'Bread 2',
              type: ItemType.BREAD,
              quantity: bread2.quantity,
              productionDate: new Date(
                Date.now() - bread2.age * 24 * 60 * 60 * 1000,
              ),
              unitPrice: bread2.unitPrice,
              unit: Unit.LOAF,
              currency: Currency.EUR,
              brandOriginCountry: Country.NL,
            },
          ];
          expect(breadDiscountStrategy.calculateDiscount(items)).toBe(
            expectedDiscount,
          );
        });
      });
    });
    describe('1,2,4,5,7 days bread should not have discount', () => {
      const testCases = [
        {
          age: 1,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 0,
        },
        {
          age: 2,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 0,
        },
        {
          age: 4,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 0,
        },
        {
          age: 5,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 0,
        },
        {
          age: 7,
          unitPrice: unitPrices['price1'],
          quantity: quantities['quantity2'],
          expectedDiscount: 0,
        },
        { age: 0, unitPrice: 10, quantity: 1, expectedDiscount: 0 },
        { age: 1, unitPrice: 10, quantity: 1, expectedDiscount: 0 },
      ];

      testCases.forEach(({ age, unitPrice, quantity, expectedDiscount }) => {
        it(`returns correct discount for a ${age} days old bread when unit price = ${unitPrice}, quantity = ${quantity}`, () => {
          const items = [
            {
              itemId: '1',
              name: 'Bread',
              type: ItemType.BREAD,
              quantity: quantity,
              productionDate: new Date(Date.now() - age * 24 * 60 * 60 * 1000), // age days old
              unitPrice: unitPrice,
              unit: Unit.LOAF,
              currency: Currency.EUR,
              brandOriginCountry: Country.NL,
            },
          ];
          expect(breadDiscountStrategy.calculateDiscount(items)).toBe(
            expectedDiscount,
          );
        });
      });
    });
    describe('Bread from a thousand years ago, Bread from future', () => {
      const testCases = [
        {
          age: 1000,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 0,
        },
        {
          age: -5555,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 0,
        },
        {
          age: -88498490849809808,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 0,
        },
        {
          age: 787878781782,
          unitPrice: unitPrices['price3'],
          quantity: quantities['quantity1'],
          expectedDiscount: 0,
        },
      ];

      testCases.forEach(({ age, unitPrice, quantity, expectedDiscount }) => {
        it(`returns correct discount for a ${age} days old bread when unit price = ${unitPrice}, quantity = ${quantity}`, () => {
          const items = [
            {
              itemId: '1',
              name: 'Bread',
              type: ItemType.BREAD,
              quantity: quantity,
              productionDate: new Date(Date.now() - age * 24 * 60 * 60 * 1000), // age days old
              unitPrice: unitPrice,
              unit: Unit.LOAF,
              currency: Currency.EUR,
              brandOriginCountry: Country.NL,
            },
          ];
          expect(breadDiscountStrategy.calculateDiscount(items)).toBe(
            expectedDiscount,
          );
        });
      });
    });
  });
});
