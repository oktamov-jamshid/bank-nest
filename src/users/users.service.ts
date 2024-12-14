import { LoginUserDto } from './dto/login-user.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from './users.model';
import { ConfigService } from 'src/common/config/config.service';
import { Account } from 'src/accounts/accounts.model';
import { Transaction } from 'src/transaction/transactions.model';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users) private readonly users: typeof Users,
    @InjectModel(Account) private readonly accounts: typeof Account,
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  errors = [];
  private logError(error: any) {
    this.errors.push(error);
    this.loggerService.logError(error.message, { errors: error.errors });

    // Agar bir nechta xatoliklar bo'lsa
    if (this.errors.length > 1) {
      // Barcha xatoliklarni loglash

      // Hammasini bir vaqtning o'zida qaytarish
      throw new BadRequestException('Multiple errors occurred');
    }

    // Agar faqat bitta xatolik bo'lsa, uni qaytarish
    throw error;
  }

  async register(createUserDto: CreateUserDto) {
    try {
      // Foydalanuvchi emailini tekshirish
      const user = await this.findByUserEmail(createUserDto.email);
      if (user) {
        throw new BadRequestException('Email already existing');
      }

      // Ro'lni tekshirish
      if (
        createUserDto.role !== 'admin' &&
        createUserDto.role !== 'worker' &&
        createUserDto.role !== 'user'
      ) {
        throw new BadRequestException('Invalid role');
      }

      // Parolni hashlash
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Foydalanuvchini yaratish
      const newUser = await this.users.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Ro'lga qarab maoshni sozlash
      if (newUser.role === 'admin' || newUser.role === 'worker') {
        newUser.salary = createUserDto.salary || 0;
        await newUser.save();
      } else {
        newUser.salary = null;
        await newUser.save();
        return newUser;
      }

      return newUser;
    } catch (error) {
      this.logError(error);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.findByUserEmail(loginUserDto.email);
      if (!user) {
        throw new NotFoundException('email or password not found');
      }

      const checkedPassword = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!checkedPassword) {
        throw new BadRequestException('email or password not found');
      }
      const accessToken = this.genetateAccessToken({
        id: user.id,
        role: user.role,
      });
      const refreshToken = this.genetateRefreshToken({ id: user.id });
      return { accessToken, refreshToken };
    } catch (error) {
      this.logError(error);
    }
  }

  async findAll() {
    try {
      const user = await this.users.findAll({
        include: [
          {
            model: this.accounts,
            attributes: ['balance', 'account_number'],
          },
        ],
        raw: false,
      });

      function formatDate(date: string | Date): string {
        return new Date(date).toISOString().split('T').join(' ').split('.')[0];
      }

      // Har bir foydalanuvchini formatlash
      const formattedUsers = user.map((user) => {
        const userData = user.get(); // Obyektni olish
        return {
          ...userData,
          createdAt: formatDate(userData.createdAt),
          updatedAt: formatDate(userData.updatedAt),
        };
      });
      return formattedUsers;
    } catch (error) {
      this.logError(error);
      console.log(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.users.findByPk(id, {
        include: [
          { model: Account, attributes: ['balance', 'account_number'] },
        ],
        raw: false,
      });
      function formatDate(date: string | Date): string {
        return new Date(date).toISOString().split('T').join(' ').split('.')[0];
      }

      // Har bir foydalanuvchini formatlash
      const userData = user.get(); // Obyektni olish
      const formattedUser = {
        ...userData,
        createdAt: formatDate(userData.createdAt),
        updatedAt: formatDate(userData.updatedAt),
      };
      return formattedUser;
    } catch (error) {
      this.logError(error);
      console.log(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.users.findByPk(id);
      return user.update(updateUserDto);
    } catch (error) {
      this.logError(error);
      console.log(error.message);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.users.findByPk(id);
      return user.destroy();
    } catch (error) {
      this.logError(error);
      console.log(error.message);
    }
  }

  async getSalary(id: number) {
    const user = await this.findOne(id);
    return `ismi: ${user.full_name} va oyligi:  ${user.salary}`;
  }

  async getBalance(id: number) {
    const user = await this.users.findOne({
      where: { id },
      include: {
        model: Account,
        attributes: ['balance'],
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Agar user bilan bog'liq hisoblar bo'lsa
    const balance = user.accounts[0]?.balance || 0; // Agar hisob mavjud bo'lsa, balansni olish

    return `Ismi: ${user.full_name} va balans: ${balance}`;
  }

  private genetateAccessToken(data) {
    try {
      return jwt.sign(data, this.configService.get('JWT_ACCESS_SECRET_TOKEN'), {
        expiresIn: '10m',
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  private genetateRefreshToken(data) {
    try {
      return jwt.sign(
        data,
        this.configService.get('JWT_REFRESH_SECRET_TOKEN'),
        { expiresIn: '10m' },
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async findByUserEmail(email: string) {
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(`${email} not found`);
      }
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }
}
