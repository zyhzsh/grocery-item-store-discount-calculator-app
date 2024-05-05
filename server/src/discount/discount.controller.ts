import { Controller, Get } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('discount')
@ApiTags('Discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get('rules')
  async getDiscountRules() {
    return this.discountService.getDiscountRules();
  }
}
