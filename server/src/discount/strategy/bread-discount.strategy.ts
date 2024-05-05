import { ItemType } from 'src/common/enums';
import { IDiscountStrategy } from '../interface/discountStrategy.interface';
import { GeneratedReceiptItemDto } from 'src/common/dto/generated-receipt.dto';
import Decimal from 'decimal.js';
import { BREAD_DISCOUNT_RULE } from '../constants/discount.rules.description';

export class BreadDiscountStrategy implements IDiscountStrategy {
  readonly rules = BREAD_DISCOUNT_RULE['rules'];

  getRules(): string[] {
    return this.rules;
  }

  private calculateEuroBreadDiscount(items: GeneratedReceiptItemDto[]): number {
    let totalDiscount = new Decimal(0);
    const buyOneTake2 = 2;
    const buyOneTake3 = 3;

    items.forEach((item) => {
      if (item.type === ItemType.BREAD) {
        const age = this.calculateAgeInDays(new Date(item.productionDate));
        if (age == 3) {
          const neededToBuy = new Decimal(
            Math.ceil(item.quantity / buyOneTake2),
          );
          const normalCost = new Decimal(item.unitPrice).times(item.quantity);
          const discountedCost = neededToBuy.times(item.unitPrice);
          totalDiscount = totalDiscount.plus(normalCost.minus(discountedCost));
        } else if (age === 6) {
          const neededToBuy = new Decimal(
            Math.ceil(item.quantity / buyOneTake3),
          );
          const normalCost = new Decimal(item.unitPrice).times(item.quantity);
          const discountedCost = neededToBuy.times(item.unitPrice);
          totalDiscount = totalDiscount.plus(normalCost.minus(discountedCost));
        }
      }
    });

    return totalDiscount.toDecimalPlaces(2).toNumber(); // Ensuring the result is rounded to two decimal places
  }

  calculateDiscount(items: GeneratedReceiptItemDto[]): number {
    const totalDiscount = new Decimal(this.calculateEuroBreadDiscount(items));
    return totalDiscount.toDecimalPlaces(2).toNumber(); // Ensuring the result is rounded to two decimal places
  }

  private calculateAgeInDays(productionDate: Date): number {
    const currentDate = new Date();
    const diff = currentDate.getTime() - productionDate.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  }
}
