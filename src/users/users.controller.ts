import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RoleGuard } from 'src/common/auth/role.guard';
import { Roles } from 'src/common/auth/role.decarator';
import { LoggerService } from 'src/logger/logger.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly loggerSevice: LoggerService
  ) {}

  @Post('register')
  // @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
  
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  // @UseGuards(AuthGuard)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'worker')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('get-salary/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'worker')
  getSalary(@Param('id') id: string) {
    return this.usersService.getSalary(+id);
  }

  @Get('/balance/:id') // URL format: /users/:id/balance
  @UseGuards(AuthGuard, RoleGuard)
  async getBalance(@Param('id') id: number) {
    try {
      // getBalance metodini chaqiramiz
      const balanceMessage = await this.usersService.getBalance(id);
      return { message: balanceMessage }; // Balansni foydalanuvchiga yuborish
    } catch (error) {
      throw new NotFoundException('User not found or error occurred'); // Agar foydalanuvchi topilmasa yoki xatolik yuzaga kelsa
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)  // AuthGuard va RoleGuard qo'llanadi
  @Roles('admin')  // Faqat admin rolidagi foydalanuvchilarga ruxsat beriladi
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
