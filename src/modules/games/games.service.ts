import { Injectable } from "@nestjs/common";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { Like, Repository } from "typeorm";
import { CardsService } from "../cards/cards.service";
import { CardType } from "../cards/entities/card.entity";

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private cardsService: CardsService,
  ) {}

  async create(dto: CreateGameDto) {
    return await this.gameRepository.save(dto);
  }

  async start(game: Game) {
    game.startedAt = new Date();
    game.situations = await this.cardsService.generateDeckOf(CardType.situation);
    game.pictures = await this.cardsService.generateDeckOf(CardType.picture);
    return await this.gameRepository.save(game);
  }

  async findAll() {
    return await this.gameRepository.find();
  }

  async findOne(id: string) {
    return await this.gameRepository.findOne({
      where: { id },
    });
  }

  async findByName(name: string) {
    return await this.gameRepository.find({
      where: { name: Like(`%${name}%`) }
    });
  }

  async join() {
    //TODO: добавить при websockets и авторизации
  }

  async update(id: string, dto: UpdateGameDto) {
    return await this.gameRepository.update(id, dto);
  }

  async remove(id: string) {
    return await this.gameRepository.delete(id);
  }
}
