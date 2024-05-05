import { Country, Currency, ItemType, Unit } from 'src/common/enums';
import { IDiscountStrategy } from '../interface/discountStrategy.interface';
import { GeneratedReceiptItemDto } from 'src/common/dto/generated-receipt.dto';
import Decimal from 'decimal.js';
import { EU_BEER_DISCOUNT_RULE } from '../constants/discount.rules.description';
export class BeerDiscountStrategy implements IDiscountStrategy {
  readonly rules = [...EU_BEER_DISCOUNT_RULE['rules']];

  getRules(): string[] {
    return this.rules;
  }
  private calculateEuroBeerDiscount(items: GeneratedReceiptItemDto[]): number {
    let totalAfterDiscount = new Decimal(0);
    let totalBeforeDiscount = new Decimal(0);
    const pricesPolicy = {
      [Country.BE]: new Decimal(3),
      [Country.DE]: new Decimal(4),
      [Country.NL]: new Decimal(2),
    };
    const packSize = 6;

    items.forEach((item) => {
      const itemTotal = new Decimal(item.unitPrice).times(item.quantity);
      totalBeforeDiscount = totalBeforeDiscount.plus(itemTotal);

      switch (item.unit) {
        case Unit.CAN:
          const cansBoughtAsPacksCounts = Math.floor(item.quantity / packSize);
          const left = item.quantity - cansBoughtAsPacksCounts * packSize;
          const discountForPacks = pricesPolicy[item.brandOriginCountry].times(
            cansBoughtAsPacksCounts,
          );
          const leftTotal = new Decimal(item.unitPrice).times(left);
          totalAfterDiscount = totalAfterDiscount
            .plus(discountForPacks)
            .plus(leftTotal);
          break;
        case Unit.PACK:
          const packTotal = pricesPolicy[item.brandOriginCountry].times(
            item.quantity,
          );
          totalAfterDiscount = totalAfterDiscount.plus(packTotal);
          break;
      }
    });

    const result = totalBeforeDiscount.minus(totalAfterDiscount);
    // Convert result to a number with two decimal places
    return result > new Decimal(0.01) ? parseFloat(result.toFixed(2)) : 0;
  }

  calculateDiscount(items: GeneratedReceiptItemDto[]): number {
    let totalDiscount = new Decimal(0);

    const euroBeers = items.filter(
      (item) =>
        item.currency === Currency.EUR &&
        item.type === ItemType.BEER &&
        (item.unit === Unit.CAN || item.unit === Unit.PACK),
    );

    if (euroBeers.length > 0) {
      totalDiscount = totalDiscount.plus(
        this.calculateEuroBeerDiscount(euroBeers),
      );
    }

    return totalDiscount.toDecimalPlaces(2).toNumber();
  }
}

// private calculateEuroBeerDiscount(items: GeneratedReceiptItemDto[]): number {
//   let totalAfterDiscount = 0;
//   let totalBeforeDiscount = 0;
//   const pricesPolicy = { [Country.BE]: 3, [Country.DE]: 4, [Country.NL]: 2 };
//   const packSize = 6;

//   items.forEach((item) => {
//     totalBeforeDiscount += item.unitPrice * item.quantity;
//     switch (item.unit) {
//       case Unit.CAN:
//       case Unit.BOTTLE:
//         {
//           const cansBoughtAsPacksCounts = Math.floor(
//             item.quantity / packSize,
//           );
//           const left = item.quantity - cansBoughtAsPacksCounts * packSize;
//           totalAfterDiscount +=
//             left * item.unitPrice +
//             cansBoughtAsPacksCounts * pricesPolicy[item.brandOriginCountry];
//         }
//         break;
//       case Unit.PACK: {
//         totalAfterDiscount +=
//           item.quantity * pricesPolicy[item.brandOriginCountry];
//       }
//     }
//   });

//   const result = totalBeforeDiscount - totalAfterDiscount;

//   return result < 0 ? 0 : result;
// }

// calculateDiscount(items: GeneratedReceiptItemDto[]): number {
//   let totalDiscount = 0;

//   const euroBeers = items.filter(
//     (item) =>
//       item.currency === Currency.EUR &&
//       item.type === ItemType.BEER &&
//       (item.unit === Unit.CAN ||
//         item.unit === Unit.BOTTLE ||
//         item.unit === Unit.PACK),
//   );

//   totalDiscount +=
//     euroBeers.length === 0 ? 0 : this.calculateEuroBeerDiscount(euroBeers);

//   return totalDiscount;
// }
