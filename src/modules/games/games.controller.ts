import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { GamesService } from './games.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { AccessTokenGuard } from "../auth/access-token.guard";

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // @Post()
  // create(@Body() createGameDto: CreateGameDto) {
  //   return this.gamesService.create(createGameDto);
  // }

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

  @Delete('/all')
  async removeAll() {
    const games = await this.findAll();
    games.forEach(el => this.remove(el.id));
  }
}
