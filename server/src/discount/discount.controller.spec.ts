import { Test } from '@nestjs/testing';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

describe('DiscountController', () => {
  let discountController: DiscountController;
  let discountService: DiscountService;

  beforeEach(async () => {
    const discountServiceMock = {
      getDiscountRules: jest.fn().mockResolvedValue({}),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [DiscountController],
      providers: [{ provide: DiscountService, useValue: discountServiceMock }],
    }).compile();

    discountController = moduleRef.get<DiscountController>(DiscountController);
    discountService = moduleRef.get<DiscountService>(DiscountService);
  });

  it('should return discount rules', async () => {
    expect(await discountController.getDiscountRules()).not.toBeNull();
  });
});
