import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { CreateItemPriceDto } from './dto/create-item-price.dto';
import { IdParamDto } from './dto/IdParamDto';
import { ItemPrice } from './entities/item-price.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('items')
@ApiTags('Items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('prices')
  async createPrice(@Body() newPrice: CreateItemPriceDto): Promise<ItemPrice> {
    return await this.itemService.createItemPrice(newPrice);
  }

  @Delete(':id')
  async deleteItem(@Param() { id }: IdParamDto): Promise<void> {
    return this.itemService.deleteItem(id);
  }

  @Delete('prices/:id')
  async deletePrice(@Param() { id }: IdParamDto): Promise<void> {
    return this.itemService.deletePrice(id);
  }

  @Get()
  async getAllItems(): Promise<Item[]> {
    return await this.itemService.findAll();
  }

  @Post()
  async createItem(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return await this.itemService.createItem(createItemDto);
  }
}
