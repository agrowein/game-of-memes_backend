import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateSituationDto } from "./dto/create-situation.dto";
import { CreateReactionDto } from "./dto/create-reaction.dto";


@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get('reactions')
  async getAllReactions() {
    return await this.cardsService.findAllReactions();
  }

  @Get('situations')
  async getAllSituations() {
    return await this.cardsService.findAllSituations();
  }

  // @Get(':id')
  // async getById(@Param('id') id: string) {
  //   return await this.cardsService.findOne(id);
  // }

  @Post('situation')
  createSituation(@Body() dto: CreateSituationDto) {
    return this.cardsService.createSituation(dto);
  }

  @Post('reaction')
  createReaction(@Body() dto: CreateReactionDto) {
    return this.cardsService.createReaction(dto);
  }
}
