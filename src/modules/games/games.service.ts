import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Like, Repository } from 'typeorm';
import { CardsService } from '../cards/cards.service';
import { UsersService } from '../users/users.service';
import { PlayStatus } from "./const";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Gameplay } from "./interfaces/Gameplay.interface";
import { randomUUID } from "crypto";


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
    const situations = await this.cardsService.findAllSituations();
    const first = situations.pop();
    game.creator = await this.usersService.findOne(userId);
    game.players = [];
    game.id = randomUUID();

    const gameplay = await this.gameplayModel.create({
      currentRound: {
        status: 'pending',
        players: [],
        situation: first,
        reactions: new Map<string, string>(),
        ready: new Map<string, boolean>(),
      },
      gameId: game.id,
      stack: [...situations],
      rounds: [],
    });
    gameplay.save();

    game.gameplayID = gameplay.id;

    return await this.gameRepository.save(game);
  }

  async start(userId: string) {
    const { currentGame } = await this.usersService.findOne(userId);
    currentGame.startedAt = new Date();
    currentGame.status = PlayStatus.Started;
    return await this.gameRepository.save(currentGame);
  }

  async findAll() {
    return await this.gameRepository.find({
      relations: {
        players: true,
      },
    });
  }

  // async playerReadyPlayRound(gameId: string, userId: string) {
  //   const game = await this.gameplayModel.findOne({ gameId }).exec();
  //   if (!game.rounds[game.currentRound].players.includes(userId))
  //     game.rounds[game.currentRound].players.push(userId);
  //
  //   if (game.ready.length === game.rounds[game.currentRound].players.length)
  //     return game.rounds[game.currentRound];
  //   else return undefined;
  // }


  async findOne(id: string) {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: {
        creator: true,
        players: true,
      }
    });
    const gameplay = await this.gameplayModel.findOne({ gameId: game.id });
    return { ...game, gameplay };
  }

  async findByName(name: string) {
    return await this.gameRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async playRound(gameId: string) {
    const gameplay = await this.gameplayModel.findOne({ gameId }).exec();
    const situationId = gameplay.stack.pop();
    if (!situationId) return undefined;
    await gameplay.save();

    return situationId;
  }

  async doStep(gameId: string, cardId: string, userId: string) {
    const game = await this.findOne(gameId);
    const gameplay = await this.gameplayModel.findOne({ gameId });
    const step = { userId, picture: cardId };
    const result = await gameplay.save();

    return undefined;
  }

  async join(userId: string, gameId: string) {
    const user = await this.usersService.findOne(userId);
    let game = await this.findOne(gameId);
    const gameplay = await this.gameplayModel.findOne({ id: game.gameplayID });

    if (!user || !game) throw Error('Нет игры или пользователя');

    const userIsExist = game.players.some((user) => user.id === userId);

    if (!userIsExist) {
      game.players.push(user);
      game = await this.gameRepository.save(game);

      gameplay.currentRound.players.push({
        id: user.id,
        cards: user.activeDeck,
        nickname: user.nickname,
        avatarURL: user.avatar,
      });
    }
    gameplay.currentRound.ready.set(userId, false);
    gameplay.save();

    return game;
  }

  async getGameplay(gameId: string) {
    return this.gameplayModel.findOne({ gameId }).exec();
  }

  async leave(userId: string) {
    const user = await this.usersService.findOne(userId);
    const game = user.currentGame;

    const gameplay = await this.gameplayModel.findOne({ gameId: game.id });
    gameplay.currentRound.players = gameplay.currentRound.players.filter((player) => player.id !== userId);
    gameplay.save();

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
    const gameplay = await this.gameplayModel.findOne({ gameId: gameId });
    const isExists = gameplay.currentRound.ready.has(userId);
    if (isExists) {
      gameplay.currentRound.ready.set(userId, status);
      gameplay.save();
    }
  }

  async getMyCards(userId: string) {}




}
