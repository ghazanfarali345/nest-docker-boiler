import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  // protected readonly Logger: Logger;

  // constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    // let user = await this.userRepository.create({
    //   fullName: 'ghazanfar',
    //   deviceToken: 'assa',
    //   email: 'asa@gmail.com',
    //   isDeleted: false,
    //   isVerified: false,
    //   password: 'abc',
    //   phoneNo: 'adfad',
    //   otp: '1211',
    //   profileImage: '121',
    //   role: 'user',
    //   pushNotificationEnabled: false,
    //   status: 'ACTIVE',
    //   stripeCustomerId: 'asdfad',
    // });

    return 'user';
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
