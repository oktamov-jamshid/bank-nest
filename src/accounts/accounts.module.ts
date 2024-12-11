import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './accounts.model';
import { Users } from 'src/users/users.model';
import { Transaction } from 'src/transaction/transactions.model';

@Module({
  imports:[SequelizeModule.forFeature([Account, Users, Transaction])],
  exports: [AccountsService],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
