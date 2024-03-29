import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  create(dto: CreateUserDto) {
    return this.userRepository.create(dto);
  }

  async save(user: User) {
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async updateLastSocketId(id: string, socketId: string) {
    const user = await this.findOne(id);
    return await this.userRepository.save(user);
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: {
        currentGame: true,
        activeDeck: true,
      }
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserPassword(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      select: { password: true },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    return await this.userRepository.update(id, dto);
  }

  async remove(id: string) {
    return await this.userRepository.delete(id);
  }
}
