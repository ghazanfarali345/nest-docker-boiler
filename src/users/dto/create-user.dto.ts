import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  @IsPhoneNumber()
  phoneNo: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(11)
  password: string;

  @IsOptional()
  @IsBoolean()
  pushNotificationEnabled?: boolean;

  @IsString()
  role: string;

  @IsString()
  @IsNotEmpty()
  deviceToken: string;

  @IsOptional()
  @IsString()
  otp: string;
}
