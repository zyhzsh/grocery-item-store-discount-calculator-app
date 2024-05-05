import { GeneratedReceiptItemDto } from 'src/common/dto/generated-receipt.dto';

export interface IDiscountStrategy {
  readonly rules: string[];
  getRules(): string[];
  calculateDiscount(items: GeneratedReceiptItemDto[]): number;
}
