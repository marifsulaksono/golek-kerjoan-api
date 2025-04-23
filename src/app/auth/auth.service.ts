import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { TokenAuth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TokenAuth)
    private readonly authRepository: Repository<TokenAuth>,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string, ip: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Upsert refresh token
    const existingToken = await this.authRepository.findOneBy({
      user_id: user.id,
      ip_address: ip,
    });

    if (existingToken) {
      // Update existing token
      await this.authRepository.update(
        { user_id: user.id, ip_address: ip },
        { token: refreshToken },
      );
    } else {
      // Insert new token
      const newToken = this.authRepository.create({
        user_id: user.id,
        ip_address: ip,
        token: refreshToken,
      });
      await this.authRepository.save(newToken);
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      metadata: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
