import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcryptjs from 'bcryptjs';
import Omit from 'src/utils/omit';
import { VerifyUserDTO } from './dto/verify-user.dto';
import { Utils } from 'src/utils/utils';
import { SendOtpDTO } from './dto/send-otp.user';
import { ResetPasswordTypeEnum, SendOtpTypeEnum } from './enums';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { LoginDTO } from './dto/login-user.dto';
import { LogoutDTO } from './dto/logout.dto';
import { IGetUserAuthInfoRequest } from 'src/interfaces';
import { PaymentGatewayService } from 'src/payment-gateway/payment-gateway.service';

@Injectable()
export class UsersService {
  protected readonly Logger: Logger;

  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly paymentService: PaymentGatewayService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 12);
  }

  async create(createUserDto: CreateUserDto) {
    let userExists = await this.userRepository.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists)
      throw new HttpException(
        {
          success: false,
          message: 'User already exists',
          status: HttpStatus.CONFLICT,
          data: null,
        },
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const otp = Utils.OTPGenerator();

    createUserDto.password = hashedPassword;
    createUserDto.otp = otp;

    let user: any = await this.userRepository.create(createUserDto);

    let stripeCustomerId = await this.paymentService.createCustomer({
      _id: user._id,
      name: user.fullName,
      email: user.email,
    });

    let updatedUser = await this.userRepository.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        stripeCustomerId: stripeCustomerId.id,
      },
      {
        new: true,
        projection: {
          password: 0,
          otp: 0,
          __v: 0,
        },
      },
    );

    if (!user)
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );

    this.mailerService
      .sendMail({
        to: user.email,
        from: 'nodeboiler@example.com',
        subject: 'Registration Otp',
        text: 'welcome',
        html: `<b>Your registration otp is: ${user.otp}</b>`,
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });

    // user = Omit(updatedUser, ['password', 'otp', '__v']);

    return {
      success: true,
      message: 'User is created successfully',
      data: updatedUser,
    };
  }

  async verifyUser(body: VerifyUserDTO) {
    const email = body.email!.toString();
    const otp = body.otp!.toString();

    let user: any = await this.userRepository.userModel
      .findOne({
        email,
      })
      .lean();

    if (!user)
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );

    if (user.otp !== otp)
      throw new HttpException(
        {
          success: false,
          message: 'Invalid otp',
          status: HttpStatus.BAD_REQUEST,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );

    const updateUser = await this.userRepository.findOneAndUpdate(
      { email },
      {
        isVerified: true,
        otp: '',
      },
    );

    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    if (!updateUser)
      throw new HttpException(
        {
          success: false,
          message: 'Internal server error ',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    user = Omit(user, ['password', 'otp', '__v']);

    return {
      success: true,
      message: 'User verified successfully',
      data: user,
      token,
    };
  }

  async login(userData: LoginDTO) {
    let user: any = await this.userRepository.findOne({
      email: userData.email,
    });

    if (!user)
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );

    if (user.status === 'INACTIVE') {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Admin has banned you, kindly contact with support',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.isDeleted === true) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You have deactivated your account',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const password = await bcryptjs.compare(userData.password, user.password);

    if (!password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    user = Omit(user, ['password', 'otp', '__v']);

    this.userRepository.findOneAndUpdate(
      { _id: user._id },
      {
        deviceToken: userData.deviceToken,
      },
    );

    return {
      success: true,
      message: 'Login successful',
      data: user,
      token: token as any,
    };
  }

  async sendOtp(body: SendOtpDTO) {
    let user: any = await this.userRepository.userModel
      .findOne({
        email: body.email,
      })
      .lean();

    if (!user)
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Email not found' },
        HttpStatus.BAD_REQUEST,
      );

    const otp = Utils.OTPGenerator();

    await this.userRepository.findOneAndUpdate(
      { email: body.email },
      {
        otp,
      },
    );

    if (body.type === SendOtpTypeEnum.REGISTER_USER) {
      this.mailerService.sendMail({
        to: body.email, // List of receivers email address
        from: 'budgetpie@example.com', // Senders email address
        subject: 'Registration Otp', // Subject line
        text: 'welcome', // plaintext body
        html: `<b>Your registration otp is: ${otp}</b>`, // HTML body content
      });
    }

    if (body.type === SendOtpTypeEnum.FORGOT_PASSWORD) {
      this.mailerService.sendMail({
        to: body.email, // List of receivers email address
        from: 'budgetpie@example.com', // Senders email address
        subject: 'Forgot Password Otp', // Subject line
        text: 'welcome', // plaintext body
        html: `<b>Your password recovery otp is: ${otp}</b>`, // HTML body content
      });
    }

    return {
      success: true,
      message: 'Otp sent successfully',
      data: null,
    };
  }

  // for forgot password
  async resetPassword(body: ResetPasswordDTO) {
    let updatedUser;

    if (body.password !== body.confirmPassword) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'New password and confirm password must be same',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (body.type === ResetPasswordTypeEnum.RESET_PASSWORD) {
      const user: any = await this.userRepository.findOne({
        email: body.email,
      });
      console.log({ user });

      if (!user)
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Email not found' },
          HttpStatus.BAD_REQUEST,
        );

      const password = await bcryptjs.compare(body.password, user.password);

      if (password)
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'New password must be different from old password',
          },
          HttpStatus.FORBIDDEN,
        );

      const hashedPassword = await this.hashPassword(body.password);

      updatedUser = await this.userRepository.findOneAndUpdate(
        { email: body.email },
        { password: hashedPassword },
      );
    }

    if (updatedUser) {
      return {
        success: true,
        message: 'Password updated successfully',
        data: null,
      };
    }
  }

  // for change password from settings
  async changePassword(body: ResetPasswordDTO) {
    let updatedUser;
    if (body.type === ResetPasswordTypeEnum.CHANGE_PASSWORD) {
      const user: any = await this.userRepository.findOne({
        email: body.email,
      });
      const password = await bcryptjs.compare(body.oldPassword, user.password);

      if (!password)
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Old password is not correct',
          },
          HttpStatus.FORBIDDEN,
        );

      const hashedPassword = await this.hashPassword(body.password);

      updatedUser = await this.userRepository.findOneAndUpdate(
        { email: body.email },
        { password: hashedPassword },
      );
    }

    if (updatedUser) {
      return {
        success: true,
        message: 'Password updated successfully',
        data: null,
      };
    }
  }

  async logout(req: IGetUserAuthInfoRequest, data: LogoutDTO) {
    const tok = await this.userRepository.findOneAndUpdate(
      {
        _id: req.user._id,
        deviceToken: data.deviceToken,
      },
      {
        deviceToken: '',
      },
    );

    return {
      success: true,
      message: 'User logged out successfully',
      data: null,
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
