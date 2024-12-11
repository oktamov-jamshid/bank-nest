import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transactions.model';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RoleGuard } from 'src/common/auth/role.guard';
import { Roles } from 'src/common/auth/role.decarator';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard) 
  @Roles('user')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get('account/:id')
  @UseGuards(AuthGuard, RoleGuard) 
  @Roles('admin', 'user')
  async findAll(@Param('id', ParseIntPipe)id: number) {
    try {
    return this.transactionService.findAll(id);
    } catch (error) {
      console.log(error.message);
      
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard) 
  @Roles('admin', 'user')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard) 
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard) 
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
