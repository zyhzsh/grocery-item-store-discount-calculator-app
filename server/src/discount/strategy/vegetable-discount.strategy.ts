import { ItemType, Unit } from 'src/common/enums';
import { IDiscountStrategy } from '../interface/discountStrategy.interface';
import { GeneratedReceiptItemDto } from 'src/common/dto/generated-receipt.dto';
import Decimal from 'decimal.js';
import { VEGETABLE_DISCOUNT_RULE } from '../constants/discount.rules.description';

export class VegetableDiscountStrategy implements IDiscountStrategy {
  readonly rules = VEGETABLE_DISCOUNT_RULE['rules'];

  getRules(): string[] {
    return this.rules;
  }

  private calculateVegetableDiscount(items: GeneratedReceiptItemDto[]): number {
    let total = new Decimal(0);
    let totalWeight = new Decimal(0);
    const discountPolicy = {
      '5%': new Decimal(0.05),
      '7%': new Decimal(0.07),
      '10%': new Decimal(0.1),
    };

    items.forEach((item) => {
      if (item.type === ItemType.VEGETABLE) {
        const itemWeight = new Decimal(item.quantity).times(
          item.unit === Unit.KILOGRAM ? 1000 : 1,
        );
        totalWeight = totalWeight.plus(itemWeight);
        total = total.plus(new Decimal(item.unitPrice).times(item.quantity));
      }
    });

    let discount = new Decimal(0);
    if (totalWeight.greaterThanOrEqualTo(500)) {
      discount = discountPolicy['10%'];
    } else if (totalWeight.greaterThan(100)) {
      discount = discountPolicy['7%'];
    } else if (totalWeight.greaterThan(0)) {
      discount = discountPolicy['5%'];
    }

    return total.times(discount).toDecimalPlaces(2).toNumber(); //Auto round.. like 1.333 => 1.33 , 1.337 => 1.34
  }

  calculateDiscount(items: GeneratedReceiptItemDto[]): number {
    return this.calculateVegetableDiscount(items); // rounded discount
  }
}
