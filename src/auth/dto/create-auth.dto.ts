import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
  @IsEmail({}, { message: 'Invalid email'})
  @IsString({ message: 'Email must be a string'})
  @IsNotEmpty({ message: 'Email is required'})
  email: string;

  @IsString({ message: 'Password must be a string'})
  @IsNotEmpty({ message: 'Password is required'})
  password: string;

}
