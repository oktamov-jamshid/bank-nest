import { Injectable, UseGuards } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './accounts.model';
import { Users } from 'src/users/users.model';
import { Transaction } from 'src/transaction/transactions.model';


@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account) private readonly accounts: typeof Account,
    @InjectModel(Transaction) private readonly transaction: Transaction,
  ) {}

  
  async create(createAccountDto: CreateAccountDto) {
    try {
      const account = await this.accounts.create(createAccountDto);
      return account;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findAll() {
    try {
      const accounts = await this.accounts.findAll({
        include: [
          { model: Users, attributes: ['full_name', 'email', 'id', 'role'],
            // include: [
            //   {
            //     model: Transaction,
            //     attributes: [
            //       'from_account',
            //       'to_account',
            //       'transaction_type',
            //       'amount',
            //     ],
            //   },
            // ],
           },
        ],
        raw: false
      });

      function formatDate(date: string | Date): string {
        return new Date(date).toISOString().split('T').join(' ').split('.')[0];
      }
      
      // Har bir foydalanuvchini formatlash
      const formattedAccounts = accounts.map((account) => {
        const accountData = account.get(); // Obyektni olish
        return {
          ...accountData,
          createdAt: formatDate(accountData.createdAt),
          updatedAt: formatDate(accountData.updatedAt),
        };
      });
      return formattedAccounts;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const accounts = await this.accounts.findByPk(id, {
        include: [
          { model: Users, attributes: ['full_name', 'email', 'id', 'role'],
            // include: [
            //   {
            //     model: Transaction,
            //     attributes: [
            //       'from_account',
            //       'to_account',
            //       'transaction_type',
            //       'amount',
            //     ],
            //   },
            // ],
           }
      ],
        raw: false
      });
      function formatDate(date: string | Date): string {
        return new Date(date).toISOString().split('T').join(' ').split('.')[0];
      }
      
      // Har bir foydalanuvchini formatlash
      const accountData = accounts.get(); // Obyektni olish
      const formattedAccount = {
        ...accountData,
        createdAt: formatDate(accountData.createdAt),
        updatedAt: formatDate(accountData.updatedAt),
      };
      return formattedAccount;
    } catch (error) {}
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    try {
      const account = await this.accounts.findByPk(id);
      if (!account) {
        return 'Account not found';
      }

      if (updateAccountDto.balance !== undefined) {
        account.balance = updateAccountDto.balance;
      }

      await account.update(updateAccountDto);
      return account
      
    } catch (error) {
      console.log(error.message);
    }
  }

  async remove(id: number) {
    try {
      const account = await this.accounts.findByPk(id);
      if (!account) {
        return 'Account not found';
      }

      await account.destroy();
      return 'Account deleted successfully';
    } catch (error) {
      console.log(error.message);
    }
  }
}
