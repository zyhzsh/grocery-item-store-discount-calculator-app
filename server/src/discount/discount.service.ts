import { Injectable } from '@nestjs/common';
import { VegetableDiscountStrategy } from './strategy/vegetable-discount.strategy';
import { BreadDiscountStrategy } from './strategy/bread-discount.strategy';
import { BeerDiscountStrategy } from './strategy/beer-discount.strategy';
import { ItemType } from 'src/common/enums';
import { GeneratedReceiptItemDto } from 'src/common/dto/generated-receipt.dto';

const DISCOUNT_RULES = {
  [ItemType.VEGETABLE]: new VegetableDiscountStrategy(),
  [ItemType.BREAD]: new BreadDiscountStrategy(),
  [ItemType.BEER]: new BeerDiscountStrategy(),
};
@Injectable()
export class DiscountService {
  getDiscountRules() {
    return DISCOUNT_RULES;
  }

  async calculateDiscount(
    receiptItems: GeneratedReceiptItemDto[],
  ): Promise<number> {
    let totalDiscount = 0;
    for (const [_, strategy] of Object.entries(DISCOUNT_RULES)) {
      totalDiscount += await strategy.calculateDiscount(receiptItems);
    }
    return totalDiscount;
  }
}
