import { Country, Currency, ItemType, Unit } from 'src/common/enums';

import { VegetableDiscountStrategy } from './vegetable-discount.strategy';
import { GeneratedReceiptItemDto } from 'src/common/dto/generated-receipt.dto';

describe('VegetableDiscountStrategy', () => {
  const vegetableDiscountStrategy = new VegetableDiscountStrategy();

  describe('getRules', () => {
    it('returns the discount rule description', () => {
      const rules = vegetableDiscountStrategy.getRules();
      expect(rules).not.toBeNull();
    });
  });

  describe('calculateDiscount', () => {
    it('returns 0 when no items are provided', () => {
      const items = [];
      expect(vegetableDiscountStrategy.calculateDiscount(items)).toBe(0);
    });
    it('returns 0 when no vegetable items are present', () => {
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
      expect(vegetableDiscountStrategy.calculateDiscount(items)).toBe(0);
    });
    const vegetable1: GeneratedReceiptItemDto = {
      itemId: 'blabla',
      name: 'veg blabla',
      productionDate: new Date(),
      unitPrice: 5.4,
      type: ItemType.VEGETABLE,
      quantity: 6.8,
      unit: Unit.GRAM,
      currency: Currency.EUR,
      brandOriginCountry: Country.NL,
    };
    const vegetable2: GeneratedReceiptItemDto = {
      itemId: 'blabla',
      name: 'veg blabla',
      productionDate: new Date(),
      unitPrice: 1,
      type: ItemType.VEGETABLE,
      quantity: 200,
      unit: Unit.GRAM,
      currency: Currency.EUR,
      brandOriginCountry: Country.NL,
    };
    const vegetable3: GeneratedReceiptItemDto = {
      itemId: 'blabla',
      name: 'veg blabla',
      productionDate: new Date(),
      unitPrice: 1,
      type: ItemType.VEGETABLE,
      quantity: 0.5,
      unit: Unit.KILOGRAM,
      currency: Currency.EUR,
      brandOriginCountry: Country.NL,
    };

    describe('one vegetables on list', () => {
      it(`returns correct discount when the vegetable, unitPice = ${vegetable1.unitPrice}, weight = ${vegetable1.quantity} , unit=${vegetable1.unit}`, () => {
        const items = [vegetable1];
        expect(vegetableDiscountStrategy.calculateDiscount(items)).toBe(1.84);
      });
      it(`returns correct discount when the vegetable, unitPice = ${vegetable2.unitPrice}, weight = ${vegetable2.quantity} , unit=${vegetable2.unit}`, () => {
        const items = [vegetable2];
        expect(vegetableDiscountStrategy.calculateDiscount(items)).toBe(14);
      });
      it(`returns correct discount when the vegetable, unitPice = ${vegetable3.unitPrice}, weight = ${vegetable3.quantity} , unit=${vegetable3.unit}`, () => {
        const items = [vegetable3];
        expect(vegetableDiscountStrategy.calculateDiscount(items)).toBe(0.05);
      });
    });
    describe('mutiple vegetables on list', () => {
      it(`returns correct discount when 
      vegetable-A(unitPice = ${vegetable1.unitPrice}, weight = ${vegetable1.quantity} , unit=${vegetable1.unit})
      vegetable-B(unitPice = ${vegetable2.unitPrice}, weight = ${vegetable2.quantity} , unit=${vegetable2.unit}) 
      `, () => {
        const items = [vegetable1, vegetable2];
        expect(vegetableDiscountStrategy.calculateDiscount(items)).toBe(16.57);
      });
      it(`returns correct discount when 
      vegetable-A(unitPice = ${vegetable1.unitPrice}, weight = ${vegetable1.quantity} , unit=${vegetable1.unit})
      vegetable-B(unitPice = ${vegetable2.unitPrice}, weight = ${vegetable2.quantity} , unit=${vegetable2.unit}) 
      vegetable-C(unitPice = ${vegetable3.unitPrice}, weight = ${vegetable3.quantity} , unit=${vegetable3.unit}) 
      `, () => {
        const items = [vegetable1, vegetable2, vegetable3];
        expect(vegetableDiscountStrategy.calculateDiscount(items)).toBe(23.72);
      });
    });
  });
});
