import { Test } from '@nestjs/testing';
import { DiscountService } from './discount.service';
import { GeneratedReceiptItemDto } from 'src/common/dto/generated-receipt.dto';
import { Country, Currency, ItemType, Unit } from 'src/common/enums';

describe('DiscountService', () => {
  let discountService: DiscountService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DiscountService],
    }).compile();

    discountService = moduleRef.get<DiscountService>(DiscountService);
  });

  it('should be defined', () => {
    expect(discountService).toBeDefined();
  });

  describe('calculateDiscount', () => {
    it('should calculate correct discount for a single type of beer in cans', async () => {
      const beers: GeneratedReceiptItemDto[] = [
        {
          itemId: 'beer1',
          name: 'German Premium Lager',
          type: ItemType.BEER,
          quantity: 12, // Two packs
          productionDate: new Date(),
          unitPrice: 1,
          unit: Unit.CAN,
          currency: Currency.EUR,
          brandOriginCountry: Country.DE,
        },
      ];

      const expectedDiscount = 12 * 1 - 4 * 2; // €12x1 - €4 x 2 packs
      const result = await discountService.calculateDiscount(beers);
      expect(result).toBe(expectedDiscount);
    });

    it('should calculate no discount for beer not in EUR', async () => {
      const beers: GeneratedReceiptItemDto[] = [
        {
          itemId: 'beer2',
          name: 'American Ale',
          type: ItemType.BEER,
          quantity: 6,
          productionDate: new Date(),
          unitPrice: 1,
          unit: Unit.CAN,
          currency: Currency.USD,
          brandOriginCountry: Country.DE,
        },
      ];

      const expectedDiscount = 0;
      const result = await discountService.calculateDiscount(beers);
      expect(result).toBe(expectedDiscount);
    });

    it('should apply discount for bread based on age', async () => {
      const breads: GeneratedReceiptItemDto[] = [
        {
          itemId: 'bread1',
          name: 'Whole Wheat Bread',
          type: ItemType.BREAD,
          brandOriginCountry: Country.NL,
          quantity: 3,
          productionDate: new Date(
            new Date().setDate(new Date().getDate() - 3),
          ), // 3 days old
          unitPrice: 2,
          unit: Unit.LOAF,
          currency: Currency.EUR,
        },
      ];

      const expectedDiscount = 2; // Buy 1, get 2 (1 paid, 2 free), thus 2 loafs free worth €2 each
      const result = await discountService.calculateDiscount(breads);
      expect(result).toBe(expectedDiscount);
    });

    it('should calculate discount for vegetables based on weight', async () => {
      const vegetables: GeneratedReceiptItemDto[] = [
        {
          itemId: 'veggie1',
          name: 'Organic Tomatoes',
          type: ItemType.VEGETABLE,
          quantity: 600, // 600 grams
          brandOriginCountry: Country.NL,
          productionDate: new Date(),
          unitPrice: 1,
          unit: Unit.GRAM,
          currency: Currency.EUR,
        },
      ];

      const expectedDiscount = 60; // 10% of €600
      const result = await discountService.calculateDiscount(vegetables);
      expect(result).toBeCloseTo(expectedDiscount);
    });

    it('should calculate combined discounts for multiple item types', async () => {
      const items: GeneratedReceiptItemDto[] = [
        {
          itemId: 'beer1',
          name: 'German Premium Lager',
          type: ItemType.BEER,
          quantity: 12, // Two packs
          productionDate: new Date(),
          unitPrice: 1,
          unit: Unit.CAN,
          currency: Currency.EUR,
          brandOriginCountry: Country.DE,
        },
        {
          itemId: 'bread1',
          name: 'Whole Wheat Bread',
          type: ItemType.BREAD,
          brandOriginCountry: Country.NL,
          quantity: 3,
          productionDate: new Date(
            new Date().setDate(new Date().getDate() - 3),
          ), // 3 days old
          unitPrice: 2,
          unit: Unit.LOAF,
          currency: Currency.EUR,
        },
        {
          itemId: 'veggie1',
          name: 'Organic Tomatoes',
          type: ItemType.VEGETABLE,
          brandOriginCountry: Country.NL,
          quantity: 600,
          productionDate: new Date(),
          unitPrice: 1,
          unit: Unit.GRAM,
          currency: Currency.EUR,
        },
      ];

      const expectedDiscount = 4 + 2 + 60;

      const result = await discountService.calculateDiscount(items);
      expect(result).toBeCloseTo(expectedDiscount);
    });
  });
});
