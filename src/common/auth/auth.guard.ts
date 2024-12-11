import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import * as jwt from 'jsonwebtoken';
  import { ConfigService } from '../config/config.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
  
      // Tokenni olish
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Token not found');
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
  
      try {
        // Tokenni tasdiqlash
        const secret = this.configService.get('JWT_ACCESS_SECRET_TOKEN');
        const decoded = jwt.verify(token, secret);
  
        // Foydalanuvchi ma'lumotlarini so'rovga qo'shish
        request.user = decoded;
        return true;
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new ForbiddenException('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
          throw new ForbiddenException('Invalid token');
        } else {
          throw new ForbiddenException('Authorization failed');
        }
      }
    }
  }
  