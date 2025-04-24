import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Ip,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { ResponseService } from 'src/shared/service/response';
import { Response } from 'express';
import { Public } from '../../shared/decorators/public.decorator';
import { CreateUserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly responseService: ResponseService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Ip() ip: string,
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ) {
    try {
      const token = await this.authService.signIn(
        loginDto.email,
        loginDto.password,
        ip,
      );
      return this.responseService.success(res, token, 'Login successful');
    } catch (error) {
      return this.responseService.failed(
        res,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  @HttpCode(200)
  @Public()
  async refresh(
    @Ip() ip: string,
    @Res() res: Response,
    @Body('refresh_token') refresh_token: string,
  ) {
    const result = await this.authService.refreshToken(refresh_token, ip);
    this.responseService.success(res, result, 'Token berhasil diperbarui');
  }

  @Public()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.create(createUserDto);
      user.password = '';
      this.responseService.success(res, user, 'User registerd successfully');
    } catch (error) {
      return this.responseService.failed(
        res,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
