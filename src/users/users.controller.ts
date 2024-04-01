import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyUserDTO } from './dto/verify-user.dto';
import { SendOtpDTO } from './dto/send-otp.user';
import { LoginDTO } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() LoginDTO: LoginDTO) {
    return this.usersService.login(LoginDTO);
  }

  @Post('/verifyOtp')
  verifyOtp(@Body() VerifyUserDTO: VerifyUserDTO) {
    return this.usersService.verifyUser(VerifyUserDTO);
  }

  @Post('/resendOTP')
  resendOTP(@Body() SendOtpDTO: SendOtpDTO) {
    return this.usersService.sendOtp(SendOtpDTO);
  }

  @Post('/forgotPassword')
  forgotPassword(@Body() SendOtpDTO: SendOtpDTO) {
    return this.usersService.sendOtp(SendOtpDTO);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
