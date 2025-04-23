import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { config } from 'dotenv';
config();

import { ResponseService } from 'src/shared/service/response';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly responseService: ResponseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.responseService.failed(response, 'Token not found', 401);
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      request['user'] = payload;

      // Mengecek apakah role sesuai dengan yang dibutuhkan
      const requiredRoles = this.reflector.get<string>(
        'requiredRoles',
        context.getHandler(),
      );
      if (requiredRoles && !this.hasRole(payload, requiredRoles)) {
        this.responseService.failed(response, 'Access Denied', 403);
        return false;
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        this.responseService.failed(response, 'Token expired', 401);
        return false;
      } else {
        this.responseService.failed(response, 'Invalid token', 401);
        return false;
      }
    }

    return true;
  }

  // Fungsi untuk memeriksa token pada header request
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  // Fungsi untuk memeriksa apakah pengguna memiliki role yang sesuai
  private hasRole(user: any, requiredRoles: string): boolean {
    try {
      if (requiredRoles === '') {
        return true;
      }
      const accessMap = JSON.parse(user.access);
      const requiredPermissions = requiredRoles.split(',');

      for (const permission of requiredPermissions) {
        const [feature, activity] = permission.split('.');

        if (!accessMap[feature] || !accessMap[feature][activity]) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
