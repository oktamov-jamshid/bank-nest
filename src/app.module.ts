import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionModule } from './transaction/transaction.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharingModule } from './common/shering.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      username: 'postgres',
      password: '123456',
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AccountsModule,
    TransactionModule,
    SharingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
