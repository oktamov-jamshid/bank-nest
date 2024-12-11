import { IsEmail, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'email kiritilishi kerak' })
  @IsEmail({}, { message: 'Email kiritilishi xato' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password bosh bolmasligi kerask' })
  @Min(6, { message: 'Password kamida 6 ta kiritilishi kerak' })
  @Max(6, { message: 'Password  30 ta kop bolmasligi kerak' })
  password: string;
}
