import { Account } from './../accounts/accounts.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import { Users } from 'src/users/users.model';
import { Op } from 'sequelize';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
    @InjectModel(Account) private readonly accounts: typeof Account,
    @InjectModel(Users) private readonly users: typeof Users,
    private readonly loggerService: LoggerService,
  ) {}

  errors = [];
  private logError(error: any) {
    this.errors.push(error);
    this.loggerService.logError(error.message, { errors: error.errors });

    // Agar bir nechta xatoliklar bo'lsa
    if (this.errors.length > 1) {
      // Hammasini bir vaqtning o'zida qaytarish
      throw new BadRequestException('Multiple errors occurred');
    }
    // Agar faqat bitta xatolik bo'lsa, uni qaytarish
    throw error;
  }
  async create(createTransactionDto: CreateTransactionDto) {
    try {
      let fromAccount = await this.accounts.findByPk(
        createTransactionDto.from_account,
      );
      if (!fromAccount) {
        throw new BadRequestException('From account not found');
      }

      let toAccount = await this.accounts.findByPk(
        createTransactionDto.to_account,
      );
      if (!toAccount) {
        throw new BadRequestException('To account not found');
      }

      let fePercentage = 0;
      let feAmount = 0;

      if (createTransactionDto.amount > 1000) {
        fePercentage = 10;
      } else {
        fePercentage = 5;
      }
      feAmount = (createTransactionDto.amount * fePercentage) / 100;
      let transaction;
      // Tranzaksiya turiga qarab harakat qilish
      if (createTransactionDto.transaction_type === 'transfer') {
        if (fromAccount.balance < createTransactionDto.amount + feAmount) {
          throw new BadRequestException("Hisobingizda yetarli mablag' yo'q");
        }
        
        fromAccount.balance = parseFloat(
          (parseFloat(fromAccount.balance.toString()) - (createTransactionDto.amount + feAmount)).toFixed(2)
        );
        
        toAccount.balance = parseFloat(
          (parseFloat(toAccount.balance.toString()) + createTransactionDto.amount).toFixed(2)
        );

        transaction = await this.transactions.create({
          ...createTransactionDto,
          fe_percentage: fePercentage,
          fe_amount: feAmount,
        });
      } else if (createTransactionDto.transaction_type === 'deposit') {
        toAccount.balance += createTransactionDto.amount;

        transaction = await this.transactions.create({
          ...createTransactionDto,
          fe_percentage: fePercentage,
          fe_amount: feAmount,
        });
      } else if (createTransactionDto.transaction_type === 'withdraw') {
        if (fromAccount.balance < createTransactionDto.amount) {
          throw new BadRequestException("Hisobingizda yetarli mablag' yo'q");
        }
        fromAccount.balance -= createTransactionDto.amount;

        transaction = await this.transactions.create({
          ...createTransactionDto,
          fe_percentage: fePercentage,
          fe_amount: feAmount,
        });
      } else {
        throw new BadRequestException("Noto'g'ri tranzaksiya turi");
      }
      await fromAccount.save();
      await toAccount.save();

      return { transaction, fromAccount, toAccount };
    } catch (error) {
      this.logError(error);
      // console.log(error.message);
      // throw error;
    }
  }

  // Boshqa metodlar (findAll, findOne, update, remove) shu holda qoladi...
  async findAll(account_id: number) {
    try {
      const transactions = await this.transactions.findAll({
        where: {
          [Op.or]: [{ from_account: account_id }, { to_account: account_id }],
        },
        include: [
          {
            model: this.accounts,
            as: 'fromAccount',
            include: [{ model: this.users, attributes: ['full_name'] }],
          },
          {
            model: this.accounts,
            as: 'toAccount',
            include: [{ model: this.users, attributes: ['full_name'] }],
          },
        ],
      });

      // Formatlash uchun yordamchi funksiya
      function formatDate(date: string | Date): string {
        // Agar date Date tipida bo'lsa, uni to'g'ri formatlash
        if (date instanceof Date) {
          return date.toISOString().split('T').join(' ').split('.')[0];
        }
        // Agar string bo'lsa, uni Date obyekti sifatida qaytarish
        return new Date(date).toISOString().split('T').join(' ').split('.')[0];
      }
  
      // Har bir transaction elementini formatlash
      const formattedTransactions = transactions.map((transaction) => {
        const transactionData = transaction.get({ plain: true }); // Obyektni olish
  
        // Formatlash uchun fromAccount va toAccount ichidagi createdAt va updatedAt
        const formattedFromAccount = transactionData.fromAccount
          ? {
              ...transactionData.fromAccount,
              createdAt: formatDate(transactionData.fromAccount.createdAt),
              updatedAt: formatDate(transactionData.fromAccount.updatedAt),
            }
          : null;
  
        const formattedToAccount = transactionData.toAccount
          ? {
              ...transactionData.toAccount,
              createdAt: formatDate(transactionData.toAccount.createdAt),
              updatedAt: formatDate(transactionData.toAccount.updatedAt),
            }
          : null;
  
        return {
          ...transactionData,
          createdAt: formatDate(transactionData.createdAt),
          updatedAt: formatDate(transactionData.updatedAt),
          fromAccount: formattedFromAccount,
          toAccount: formattedToAccount,
        };
      });
  
      return formattedTransactions;
      
    } catch (error) {
      this.logError(error);
      // console.log(error.message);
    }
  }

  async findOne(account_id: number) {
    try {
      const transactions = await this.transactions.findAll({
        where: {
          [Op.or]: [{ from_account: account_id }, { to_account: account_id }],
        },
        include: [
          {
            model: this.accounts,
            as: 'fromAccount',
            include: [{ model: this.users, attributes: ['full_name'] }],
          },
          {
            model: this.accounts,
            as: 'toAccount',
            include: [{ model: this.users, attributes: ['full_name'] }],
          },
        ],
      });
  
      // Formatlash uchun yordamchi funksiya
      function formatDate(date: string | Date): string {
        // Agar date Date tipida bo'lsa, uni to'g'ri formatlash
        if (date instanceof Date) {
          return date.toISOString().split('T').join(' ').split('.')[0];
        }
        // Agar string bo'lsa, uni Date obyekti sifatida qaytarish
        return new Date(date).toISOString().split('T').join(' ').split('.')[0];
      }
  
      // Har bir transaction elementini formatlash
      const formattedTransactions = transactions.map((transaction) => {
        const transactionData = transaction.get({ plain: true }); // Obyektni olish
  
        // Formatlash uchun fromAccount va toAccount ichidagi createdAt va updatedAt
        const formattedFromAccount = transactionData.fromAccount
          ? {
              ...transactionData.fromAccount,
              createdAt: formatDate(transactionData.fromAccount.createdAt),
              updatedAt: formatDate(transactionData.fromAccount.updatedAt),
            }
          : null;
  
        const formattedToAccount = transactionData.toAccount
          ? {
              ...transactionData.toAccount,
              createdAt: formatDate(transactionData.toAccount.createdAt),
              updatedAt: formatDate(transactionData.toAccount.updatedAt),
            }
          : null;
  
        return {
          ...transactionData,
          createdAt: formatDate(transactionData.createdAt),
          updatedAt: formatDate(transactionData.updatedAt),
          fromAccount: formattedFromAccount,
          toAccount: formattedToAccount,
        };
      });
  
      return formattedTransactions;
    } catch (error) {
      this.logError(error);
      // console.log('Error: ', error.message);
      // throw new Error('Error fetching transactions');
    }
  }
   

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      const transaction = await this.transactions.findByPk(id);
      if (!id) {
        throw new BadRequestException('Transaction not found');
      }
      return transaction.update(updateTransactionDto);
    } catch (error) {
      this.logError(error);
      // console.log(error.message);
    }
  }

  async remove(id: number) {
    try {
      const transaction = await this.transactions.findByPk(id);
      if (!id) {
        throw new BadRequestException('Transaction not found');
      }
      await transaction.destroy();
      return `Transaction with id ${id} deleted`;
    } catch (error) {
      this.logError(error);
      // console.log(error.message);
    }
  }
}
