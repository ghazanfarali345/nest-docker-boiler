import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class LogoutDTO {
  @IsNotEmpty()
  @IsString()
  deviceToken: string;

  // @IsNotEmpty()
  // @IsString()
  // deviceType?: string;
}
