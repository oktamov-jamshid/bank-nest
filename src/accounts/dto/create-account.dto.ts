import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({ message: 'Bosh bolmasligi kerak' })
  @IsNumber({}, { message: 'Raqam bolishi kerak' })
  user_id: number;

  @IsNumber({}, { message: 'Raqam bolishi kerak' })
  @IsNotEmpty({ message: 'Bosh bolmasligi kerak' })
  account_number: number;

  @IsDecimal({ decimal_digits: '10, 2' })
  @IsNotEmpty({ message: 'Bosh bolmasligi kerak' })
  balance: number;

  @IsEnum(['USD', 'EUR', 'UZB'], {
    message: 'Faqat USD EUR yoki UZB bolishi kerak',
  })
  @IsNotEmpty({ message: 'bosh bolmasligi kerak' })
  currency_type: 'USD' | 'EUR' | 'UZB';
}
