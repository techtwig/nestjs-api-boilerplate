import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsUniqueEmail } from '../custom-validation/unique-email.validation';

export class UserRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsEmail()
  @IsUniqueEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
