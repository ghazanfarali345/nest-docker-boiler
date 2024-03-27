import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  protected readonly Logger: Logger;

  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    let user = await this.userRepository.create(createUserDto);

    return {
      success: true,
      message: 'User is created successfully',
      data: user,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
