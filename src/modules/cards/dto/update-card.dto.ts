import { PartialType } from '@nestjs/mapped-types';
import { CreateReactionDto } from './create-reaction.dto';

export class UpdateCardDto extends PartialType(CreateReactionDto) {}
