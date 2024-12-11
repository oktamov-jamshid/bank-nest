import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './users.model';
import { Account } from 'src/accounts/accounts.model';
import { Transaction } from 'src/transaction/transactions.model';

@Module({
  imports:[SequelizeModule.forFeature([Users, Account, Transaction])],
  exports:[UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
