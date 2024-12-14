import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RoleGuard } from 'src/common/auth/role.guard';
import { Roles } from 'src/common/auth/role.decarator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles('admin')
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
}
