import { Injectable } from "@nestjs/common";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { Like, Repository } from "typeorm";
import { CardsService } from "../cards/cards.service";
import { CardType } from "../cards/entities/card.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private cardsService: CardsService,
    private usersService: UsersService,
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

  async join(userId: string, gameId: string) {
    const user = await this.usersService.findOne(userId);
    const game = await this.findOne(gameId);

    if (!user || !game) throw Error('Нет игры или пользователя');

    const userIsExist = game.players.some((user) => user.id === userId);
    if (userIsExist) throw new Error('Игрок уже есть в комнате');

    game.players.push(user);
    await this.gameRepository.save(game);
  }

  async update(id: string, dto: UpdateGameDto) {
    return await this.gameRepository.update(id, dto);
  }

  async remove(id: string) {
    return await this.gameRepository.delete(id);
  }
}
