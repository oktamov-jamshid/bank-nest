import {
    IsDecimal,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Isim bosh bolmasligi kerak' })
    full_name: string;
  
    @IsString()
    @IsNotEmpty({ message: 'email kiritilishi kerak' })
    @IsEmail({}, { message: 'Email kiritilishi xato' })
    email: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Password bosh bolmasligi kerask' })
    @Min(6, { message: 'Password kamida 6 ta kiritilishi kerak' })
    @Max(6, { message: 'Password  30 ta kop bolmasligi kerak' })
    password: string;
  
    @IsEnum(['admin', 'customer', 'teller'], { message: 'Ruxsat etilgan rollar: admin, customer yoki teller' })
    @IsNotEmpty({ message: 'role bosh bolmasligi kerak' })
    role: 'admin' | 'worker' | 'user';

    @IsDecimal({decimal_digits: '10, 2'})
    @IsOptional()
    salary?: number
  }
  