import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { Reflector } from '@nestjs/core';
  import { ConfigService } from '../config/config.service';
  
  @Injectable()
  export class RoleGuard extends AuthGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      configService: ConfigService,
    ) {
      super(configService);
    }
  
    canActivate(context: ExecutionContext): boolean {
      // AuthGuard orqali foydalanuvchini tekshirish
      const isAuth = super.canActivate(context);
      if (!isAuth) return false;
  
      // Rollarni metama'lumotdan olish
      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );
  
      // Agar rollar talab qilinmasa, o‘tkazib yuborish
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
  
      // Foydalanuvchini olish
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      // Foydalanuvchi roli talab qilingan rollardan biriga mos kelishini tekshirish
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Huquqingiz yetarli emas');
      }
  
      return true; // Ruxsat berish
    }
  }
  