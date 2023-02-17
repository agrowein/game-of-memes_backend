import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Situation } from "./entities/situation.entity";
import { CreateSituationDto } from "./dto/create-situation.dto";

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Reaction) private reactionRepository: Repository<Reaction>,
    @InjectRepository(Situation) private situationRepository: Repository<Situation>,
  ) {}

  async createReaction(dto: CreateReactionDto) {
    return await this.reactionRepository.save(dto);
  }

  async createSituation(dto: CreateSituationDto) {
    return await this.situationRepository.save(dto);
  }

  async findAllReactions() {
    return await this.reactionRepository.find();
  }

  async findAllSituations() {
    return await this.situationRepository.find();
  }

  async findOneReaction(id: string) {
    return await this.reactionRepository.findOne({
      where: { id },
    });
  }
}
