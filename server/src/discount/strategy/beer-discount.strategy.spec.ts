import { GeneratedReceiptItemDto } from 'src/common/dto/generated-receipt.dto';
import { BeerDiscountStrategy } from './beer-discount.strategy';
import { Country, Currency, ItemType, Unit } from 'src/common/enums';

describe('BeerDiscountStrategy', () => {
  const beerDiscountStrategy = new BeerDiscountStrategy();

  describe('getRules', () => {
    it('returns the discount rule description', () => {
      const rules = beerDiscountStrategy.getRules();
      expect(rules).not.toBeNull();
    });
  });

  describe('calculateDiscount', () => {
    it('returns 0 when no items are provided', () => {
      const items = [];
      expect(beerDiscountStrategy.calculateDiscount(items)).toBe(0);
    });

    it('returns 0 when no beer items are present', () => {
      const items: GeneratedReceiptItemDto[] = [
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
      expect(beerDiscountStrategy.calculateDiscount(items)).toBe(0);
    });

    describe('calculateEuroBeerDiscount', () => {
      describe(`one country, beer unit ${Unit.CAN}, one type of beer`, () => {
        const testCases = [
          //
          { country: Country.NL, expectedDiscount: 0, price: 1, quantity: 5 },
          {
            country: Country.NL,
            expectedDiscount: 7,
            price: 1.5,
            quantity: 6,
          },
          {
            country: Country.NL,
            expectedDiscount: 5.5,
            price: 1.25,
            quantity: 6,
          },
          {
            country: Country.NL,
            expectedDiscount: 5.92,
            price: 1.32,
            quantity: 6,
          },
          {
            country: Country.NL,
            expectedDiscount: 0,
            price: 0.01,
            quantity: 6,
          },
          {
            country: Country.NL,
            expectedDiscount: 2998,
            price: 500,
            quantity: 6,
          },
          { country: Country.NL, expectedDiscount: 4, price: 1, quantity: 7 },
          { country: Country.NL, expectedDiscount: 8, price: 1, quantity: 12 },
          { country: Country.NL, expectedDiscount: 8, price: 1, quantity: 13 },
          //
          { country: Country.DE, expectedDiscount: 0, price: 1, quantity: 5 },
          { country: Country.DE, expectedDiscount: 2, price: 1, quantity: 6 },
          { country: Country.DE, expectedDiscount: 2, price: 1, quantity: 7 },
          { country: Country.DE, expectedDiscount: 4, price: 1, quantity: 12 },
          { country: Country.DE, expectedDiscount: 4, price: 1, quantity: 13 },
          //
          { country: Country.BE, expectedDiscount: 0, price: 1, quantity: 5 },
          { country: Country.BE, expectedDiscount: 3, price: 1, quantity: 6 },
          { country: Country.BE, expectedDiscount: 3, price: 1, quantity: 7 },
          { country: Country.BE, expectedDiscount: 6, price: 1, quantity: 12 },
          { country: Country.BE, expectedDiscount: 6, price: 1, quantity: 13 },
        ];

        testCases.forEach(({ country, expectedDiscount, quantity, price }) => {
          it(`calculates a ${expectedDiscount} Euro discount for ${quantity} beers(${Unit.CAN}) from ${country}`, () => {
            const beers: GeneratedReceiptItemDto[] = [
              {
                itemId: 'beer-id',
                name: 'Blonde Ale',
                type: ItemType.BEER,
                quantity: quantity,
                productionDate: new Date(),
                unitPrice: price,
                unit: Unit.CAN,
                currency: Currency.EUR,
                brandOriginCountry: country,
              },
            ];
            expect(beerDiscountStrategy.calculateDiscount(beers)).toBe(
              expectedDiscount,
            );
          });
        });
      });
      describe(`one country, beer unit ${Unit.BOTTLE} , one type of beer`, () => {
        const testCases = [
          //
          { country: Country.NL, expectedDiscount: 0, price: 1, quantity: 5 },
          { country: Country.NL, expectedDiscount: 0, price: 1, quantity: 6 },
          { country: Country.NL, expectedDiscount: 0, price: 1, quantity: 7 },
          //
          { country: Country.DE, expectedDiscount: 0, price: 1, quantity: 5 },
          { country: Country.DE, expectedDiscount: 0, price: 1, quantity: 6 },
          { country: Country.DE, expectedDiscount: 0, price: 1, quantity: 7 },
          //
          { country: Country.BE, expectedDiscount: 0, price: 1, quantity: 5 },
          { country: Country.BE, expectedDiscount: 0, price: 1, quantity: 6 },
          { country: Country.BE, expectedDiscount: 0, price: 1, quantity: 7 },
        ];

        testCases.forEach(({ country, expectedDiscount, quantity, price }) => {
          it(`calculates a ${expectedDiscount} Euro discount for ${quantity} beers(${Unit.BOTTLE}) from ${country}`, () => {
            const beers = [
              {
                itemId: 'beer-id',
                name: 'Blonde Ale',
                type: ItemType.BEER,
                quantity: quantity,
                productionDate: new Date(),
                unitPrice: price,
                unit: Unit.BOTTLE,
                currency: Currency.EUR,
                brandOriginCountry: country,
              },
            ];
            expect(beerDiscountStrategy.calculateDiscount(beers)).toBe(
              expectedDiscount,
            );
          });
        });
      });
      describe(`one country, beer unit ${Unit.PACK} , one type of beer`, () => {
        const testCases = [
          { country: Country.NL, expectedDiscount: 0, price: 6, quantity: 0 },
          { country: Country.NL, expectedDiscount: 4, price: 6, quantity: 1 },
          { country: Country.NL, expectedDiscount: 8, price: 6, quantity: 2 },
          { country: Country.BE, expectedDiscount: 3, price: 6, quantity: 1 },
          { country: Country.DE, expectedDiscount: 2, price: 6, quantity: 1 },
        ];

        testCases.forEach(({ country, expectedDiscount, quantity, price }) => {
          it(`calculates a ${expectedDiscount} Euro discount for ${quantity} beers(${Unit.PACK}) from ${country}`, () => {
            const beers: GeneratedReceiptItemDto[] = [
              {
                itemId: 'beer-id',
                name: 'Blonde Ale',
                type: ItemType.BEER,
                quantity: quantity,
                productionDate: new Date(),
                unitPrice: price,
                unit: Unit.PACK,
                currency: Currency.EUR,
                brandOriginCountry: country,
              },
            ];
            expect(beerDiscountStrategy.calculateDiscount(beers)).toBe(
              expectedDiscount,
            );
          });
        });
      });
      describe(`one country, beer unit ${Unit.CAN}, more than one type of beers for the same country`, () => {
        const testCases = [
          {
            country: Country.NL,
            price1: 1,
            price2: 2,
            quantity1: 5,
            quantity2: 5,
            expectedDiscount: 0,
          },
          {
            country: Country.NL,
            price1: 1,
            price2: 2,
            quantity1: 6,
            quantity2: 5,
            expectedDiscount: 4,
          },
          {
            country: Country.NL,
            price1: 1,
            price2: 2,
            quantity1: 6,
            quantity2: 6,
            expectedDiscount: 14,
          },
        ];
        testCases.forEach(
          ({
            country,
            expectedDiscount,
            quantity1,
            quantity2,
            price1,
            price2,
          }) => {
            it(`calculates a ${expectedDiscount} Euro discount for ${
              quantity1 + quantity2
            } beers(${Unit.CAN}) from ${country}`, () => {
              const beers: GeneratedReceiptItemDto[] = [
                {
                  itemId: 'beer-id',
                  name: 'Blabla beer 1',
                  type: ItemType.BEER,
                  quantity: quantity1,
                  productionDate: new Date(),
                  unitPrice: price1,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country,
                },
                {
                  itemId: 'beer-id2',
                  name: 'Blabla beer 2',
                  type: ItemType.BEER,
                  quantity: quantity2,
                  productionDate: new Date(),
                  unitPrice: price2,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country,
                },
              ];
              expect(beerDiscountStrategy.calculateDiscount(beers)).toBe(
                expectedDiscount,
              );
            });
          },
        );
      });
      describe(`one country, beer mixed unit ${Unit.CAN} and ${Unit.BOTTLE}, more than one type of beers for the same country`, () => {
        const testCases = [
          {
            country: Country.NL,
            price1: 1,
            price2: 2,
            quantity1: 5,
            quantity2: 5,
            expectedDiscount: 0,
          },
          {
            country: Country.NL,
            price1: 1,
            price2: 2,
            quantity1: 6,
            quantity2: 5,
            expectedDiscount: 4,
          },
          {
            country: Country.NL,
            price1: 1,
            price2: 2,
            quantity1: 6,
            quantity2: 6,
            expectedDiscount: 4,
          },
        ];
        testCases.forEach(
          ({
            country,
            expectedDiscount,
            quantity1,
            quantity2,
            price1,
            price2,
          }) => {
            it(`calculates a ${expectedDiscount} Euro discount for ${
              quantity1 + quantity2
            } beers(${Unit.CAN} or ${Unit.BOTTLE})  from ${country}`, () => {
              const beers = [
                {
                  itemId: 'beer-id',
                  name: 'Blabla beer 1',
                  type: ItemType.BEER,
                  quantity: quantity1,
                  productionDate: new Date(),
                  unitPrice: price1,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country,
                },
                {
                  itemId: 'beer-id2',
                  name: 'Blabla beer 2',
                  type: ItemType.BEER,
                  quantity: quantity2,
                  productionDate: new Date(),
                  unitPrice: price2,
                  unit: Unit.BOTTLE,
                  currency: Currency.EUR,
                  brandOriginCountry: country,
                },
              ];
              expect(beerDiscountStrategy.calculateDiscount(beers)).toBe(
                expectedDiscount,
              );
            });
          },
        );
      });
      describe(`one country, beer mixed unit ${Unit.CAN} and ${Unit.PACK}, more than one type of beers for the same country`, () => {
        const testCases = [
          {
            country: Country.NL,
            price1: 1,
            price2: 12,
            quantity1: 5,
            quantity2: 1,
            expectedDiscount: 10,
          },
          {
            country: Country.NL,
            price1: 1,
            price2: 12,
            quantity1: 6,
            quantity2: 1,
            expectedDiscount: 14,
          },
        ];
        testCases.forEach(
          ({
            country,
            expectedDiscount,
            quantity1,
            quantity2,
            price1,
            price2,
          }) => {
            it(`calculates a ${expectedDiscount} Euro discount for ${quantity1} beers(${Unit.CAN}) and ${quantity2} (${Unit.PACK}) beer from ${country}`, () => {
              const beers: GeneratedReceiptItemDto[] = [
                {
                  itemId: 'beer-id',
                  name: 'Blabla beer 1',
                  type: ItemType.BEER,
                  quantity: quantity1,
                  productionDate: new Date(),
                  unitPrice: price1,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country,
                },
                {
                  itemId: 'beer-id2',
                  name: 'Blabla beer 2',
                  type: ItemType.BEER,
                  quantity: quantity2,
                  productionDate: new Date(),
                  unitPrice: price2,
                  unit: Unit.PACK,
                  currency: Currency.EUR,
                  brandOriginCountry: country,
                },
              ];
              expect(beerDiscountStrategy.calculateDiscount(beers)).toBe(
                expectedDiscount,
              );
            });
          },
        );
      });
      describe(`mixed country, beer unit ${Unit.CAN}, one type of for each country`, () => {
        const testCases = [
          {
            country1: Country.NL,
            country2: Country.BE,
            price1: 1,
            price2: 2,
            quantity1: 5,
            quantity2: 5,
            expectedDiscount: 0,
          },
          {
            country1: Country.NL,
            country2: Country.BE,
            price1: 1,
            price2: 2,
            quantity1: 6,
            quantity2: 5,
            expectedDiscount: 4,
          },
        ];
        testCases.forEach(
          ({
            country1,
            country2,
            expectedDiscount,
            quantity1,
            quantity2,
            price1,
            price2,
          }) => {
            it(`calculates a ${expectedDiscount} Euro discount for ${
              quantity1 + quantity2
            } beers(${Unit.CAN}) from ${country1} and ${country2}`, () => {
              const beers = [
                {
                  itemId: 'beer-id',
                  name: 'Blabla beer 1',
                  type: ItemType.BEER,
                  quantity: quantity1,
                  productionDate: new Date(),
                  unitPrice: price1,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country1,
                },
                {
                  itemId: 'beer-id2',
                  name: 'Blabla beer 2',
                  type: ItemType.BEER,
                  quantity: quantity2,
                  productionDate: new Date(),
                  unitPrice: price2,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country2,
                },
              ];
              expect(beerDiscountStrategy.calculateDiscount(beers)).toBe(
                expectedDiscount,
              );
            });
          },
        );
      });
      describe(`mixed country, beer unit ${Unit.CAN}, more than one type of beers for each country`, () => {
        const testCases = [
          {
            country1: Country.NL,
            country2: Country.BE,
            price1: 1,
            price2: 2,
            price3: 1,
            price4: 2,
            quantity1: 5,
            quantity2: 5,
            quantity3: 5,
            quantity4: 5,
            expectedDiscount: 0,
          },
          {
            country1: Country.NL,
            country2: Country.BE,
            price1: 1,
            price2: 2,
            price3: 1,
            price4: 1,
            quantity1: 6,
            quantity2: 5,
            quantity3: 5,
            quantity4: 5,
            expectedDiscount: 4,
          },
        ];
        testCases.forEach(
          ({
            country1,
            country2,
            price1,
            price2,
            price3,
            price4,
            quantity1,
            quantity2,
            quantity3,
            quantity4,
            expectedDiscount,
          }) => {
            it(`calculates a ${expectedDiscount} Euro discount for ${
              quantity1 + quantity2 + quantity3 + quantity4
            } beers(${Unit.CAN}) from ${country1} and ${country2}`, () => {
              const beers: GeneratedReceiptItemDto[] = [
                {
                  itemId: 'beer-id',
                  name: 'Blabla beer 1',
                  type: ItemType.BEER,
                  quantity: quantity1,
                  productionDate: new Date(),
                  unitPrice: price1,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country1,
                },
                {
                  itemId: 'beer-id',
                  name: 'Blabla beer 1',
                  type: ItemType.BEER,
                  quantity: quantity2,
                  productionDate: new Date(),
                  unitPrice: price2,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country2,
                },
                {
                  itemId: 'beer-id2',
                  name: 'Blabla beer 2',
                  type: ItemType.BEER,
                  quantity: quantity3,
                  productionDate: new Date(),
                  unitPrice: price3,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country2,
                },
                {
                  itemId: 'beer-id2',
                  name: 'Blabla beer 2',
                  type: ItemType.BEER,
                  quantity: quantity4,
                  productionDate: new Date(),
                  unitPrice: price4,
                  unit: Unit.CAN,
                  currency: Currency.EUR,
                  brandOriginCountry: country2,
                },
              ];
              expect(beerDiscountStrategy.calculateDiscount(beers)).toBe(
                expectedDiscount,
              );
            });
          },
        );
      });
    });
  });
});
