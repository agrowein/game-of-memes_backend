import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Like, Repository } from 'typeorm';
import { CardsService } from '../cards/cards.service';
import { CardType } from '../cards/entities/card.entity';
import { UsersService } from '../users/users.service';
import { PlayStatus } from "./const";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Gameplay } from "./interfaces/Gameplay.interface";
import { checkReady } from "./utils";

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @InjectModel('Gameplay') private readonly gameplayModel: Model<Gameplay>,
    private cardsService: CardsService,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateGameDto, userId: string) {
    const game = this.gameRepository.create(dto);
    game.creator = await this.usersService.findOne(userId);

    await this.gameplayModel.create({
      gameId: game.id,
      ready: [],
      stack: [],
    });

    return await this.gameRepository.save(game);
  }

  async start(userId: string) {
    const { currentGame } = await this.usersService.findOne(userId);
    currentGame.startedAt = new Date();
    currentGame.status = PlayStatus.Started;
    currentGame.pictures = await this.cardsService.generateDeckOf(CardType.picture);
    currentGame.situations = await this.cardsService.generateDeckOf(
      CardType.situation,
    );
    await this.gameplayModel.updateOne({
      gameId: currentGame.id,
    }, {
      stack: Array(20).fill(currentGame.players.map(e => e.id)).flat(),
    });
    return await this.gameRepository.save(currentGame);
  }

  async findAll() {
    return await this.gameRepository.find({
      relations: {
        players: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.gameRepository.findOne({
      where: { id },
      relations: {
        creator: true,
        players: true,
        situations: true,
        pictures: true,
      }
    });
  }

  async findByName(name: string) {
    return await this.gameRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async join(userId: string, gameId: string) {
    const user = await this.usersService.findOne(userId);
    const game = await this.findOne(gameId);

    if (!user || !game) throw Error('Нет игры или пользователя');

    const userIsExist = game.players.some((user) => user.id === userId);

    if (userIsExist) throw new Error('Игрок уже есть в комнате');

    game.players.push(user);
    return await this.gameRepository.save(game);
  }

  async update(id: string, game: Partial<Game>) {
    return await this.gameRepository.update(id, game);
  }

  async removeMyGame(userId: string, gameId: string) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      select: {
        creator: {
          id: true,
        },
      },
    });

    if (!game) throw new Error('нет такой игры!');
    if (game.creator.id !== userId)
      throw new Error('Это не твоя игра не тебе и удалять!');

    await this.remove(gameId);
    return game;
  }

  async remove(id: string) {
    return await this.gameRepository.delete(id);
  }

  async setPlayerStatus(gameId: string, userId: string, status: boolean) {
    const gameplay = await this.gameplayModel.findOne({ gameId });
    gameplay.ready.forEach((user, i) => {
      if (user.userId === userId) gameplay.ready[i].ready = status;
    });

    gameplay.save();
  }

  async start2(userId: string, gameId: string) {
    const user = await this.usersService.findOne(userId);

    // if (game.players.length != game.playersCount)
    //   throw new Error('Недостаточно игроков');

    // const newGameplay = await this.gameModel.create({
    //   gameId: game.id,
    //   stack: stack,
    // });

    // if (user.id !== game.creator.id)
    //   throw new Error('Упс нет прав братишка!');
    //
    // if (game.status !== PlayStatus.Pending)
    //   throw new Error('Игра уже идет или закончилась');



    const gameplay = await this.gameplayModel.findOne({
      gameId: gameId,
    });

    if (!checkReady(gameplay.ready)) throw new Error('Не все игроки готовы');

    // return await this.start(game);
  }

  async getMyCards(userId: string) {

  }
}
