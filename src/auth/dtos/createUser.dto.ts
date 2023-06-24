import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  password: string;
}
