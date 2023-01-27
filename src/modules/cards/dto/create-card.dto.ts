import { CardType } from '../entities/card.entity';

export class CreateCardDto {
  type: CardType;
  description?: string;
  picture?: string;
}
