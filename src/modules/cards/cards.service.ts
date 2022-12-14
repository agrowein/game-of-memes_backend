import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Card, CardType } from "./entities/card.entity";
import { Repository } from "typeorm";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Injectable()
export class CardsService {
  constructor(@InjectRepository(Card) private cardRepository: Repository<Card>) {}

  create(dto: CreateCardDto) {
    return this.cardRepository.create(dto);
  }

  async save(card: Card) {
    return await this.cardRepository.save(card);
  }

  async findAll() {
    return await this.cardRepository.find();
  }

  async findOne(id: string) {
    return await this.cardRepository.findOne({
      where: { id },
    });
  }

  async findAllByType(type: CardType) {
    return await this.cardRepository.find({
      where: { type },
    })
  }

  async update(id: string, dto: UpdateCardDto) {
    return await this.cardRepository.update(id, dto);
  }

  async remove(id: string) {
    return await this.cardRepository.delete(id);
  }
}
