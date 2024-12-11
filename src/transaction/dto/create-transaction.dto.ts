import { IsDecimal, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Raqam bolishi kerak' })
  @IsNotEmpty({ message: 'Bosh bolmasligi kerak' })
  from_account: number; // kimdan pul ketishs

  @IsNumber({}, { message: 'Raqam bolishi kerak' })
  @IsNotEmpty({ message: 'Bosh bolmasligi kerak' })
  to_account: number; // kimga pul jonatishi

  @IsNotEmpty({ message: 'Bosh bolmasligi kerak' })
  @IsEnum(['transfer', 'deposit', 'withdraw'], {
    message: 'Transfer, Deposit yoki Withdraw bolishi kerak',
  })
  transaction_type: 'transfer' | 'deposit' | 'withdraw';

  @IsNotEmpty({ message: 'Bosh bolmasligi kerak' })
  @IsDecimal({ decimal_digits: '10, 2' })
  amount: number;

  @IsNumber({}, { message: 'Raqam bolishi kerak' })
  fe_percentage?: number;

  @IsNumber({}, { message: 'Raqam bolishi kerak' })
  fe_amount?: number;
}
