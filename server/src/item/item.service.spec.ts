import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { ItemPrice } from './entities/item-price.entity';
import { Country, ItemType } from 'src/common/enums';
import { CreateItemDto } from './dto/create-item.dto';
import { NotAcceptableException } from '@nestjs/common';

describe('ItemService', () => {
  let service: ItemService;
  let mockItemRepository: MockType<Repository<Item>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockItemPriceRepository: MockType<Repository<ItemPrice>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        // Provide your mock repository with some mocked methods
        {
          provide: getRepositoryToken(Item),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ItemPrice),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    mockItemRepository = module.get(getRepositoryToken(Item));
    mockItemPriceRepository = module.get(getRepositoryToken(ItemPrice));
  });

  it('should throw NotAcceptableException when no prices are provided', async () => {
    const dto: CreateItemDto = {
      name: 'Apple',
      type: ItemType.VEGETABLE,
      brandOriginCountry: Country.DE,
      productionDate: new Date(),
      prices: [], // Empty prices array to trigger the exception
    };
    // Set up the mock to just return the provided value, although it won't reach saving due to the exception
    mockItemRepository.create.mockReturnValue(dto);
    // Expect the service to throw when the prices array is empty
    await expect(service.createItem(dto)).rejects.toThrow(
      NotAcceptableException,
    );
  });
  it('should throw NotAcceptableException when no prices are provided', async () => {
    const dto: CreateItemDto = {
      name: 'Apple',
      type: ItemType.VEGETABLE,
      brandOriginCountry: Country.DE,
      productionDate: new Date(),
      prices: [], // Empty prices array to trigger the exception
    };
    // Set up the mock to just return the provided value, although it won't reach saving due to the exception
    mockItemRepository.create.mockReturnValue(dto);
    // Expect the service to throw when the prices array is empty
    await expect(service.createItem(dto)).rejects.toThrow(
      NotAcceptableException,
    );
  });
});

// Helper type for mocking repositories
type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
