import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from 'src/accounts/accounts.model';
import { Transaction } from './transactions.model';
import { Users } from 'src/users/users.model';

@Module({
  imports: [SequelizeModule.forFeature([Account, Transaction, Users])],
  exports: [TransactionService],  
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
