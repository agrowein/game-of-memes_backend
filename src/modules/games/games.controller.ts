import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete, Query,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @Delete()
  async removeAll(@Query('all') all: boolean) {
    if (all) {
      const games = await this.findAll();
      games.forEach((el) => this.remove(el.id));
    }
  }
}
