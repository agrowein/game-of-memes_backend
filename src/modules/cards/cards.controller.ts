import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card, CardType } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { AccessTokenGuard } from '../auth/access-token.guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async getAll() {
    return await this.cardsService.findAll();
  }

  @Get()
  async getAllByType(@Query('type') type: CardType) {
    return await this.cardsService.findAllByType(type);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.cardsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCardDto) {
    return this.cardsService.create(dto);
  }

  @Post()
  async save(@Body() card: Card) {
    return await this.cardsService.save(card);
  }
}
