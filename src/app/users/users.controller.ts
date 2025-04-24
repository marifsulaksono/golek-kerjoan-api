import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ResponseService, Metadata } from 'src/shared/service/response';
import { Response } from 'express';
import { Roles } from '../../shared/decorators/public.decorator';

@Controller('api/v1/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly responseService: ResponseService, // Menginjeksikan ResponseService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(createUserDto);
    this.responseService.success(res, user, 'User created successfully'); // Menggunakan ResponseService
  }

  @Get()
  @Roles('superadmin,admin')
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      search: query.search,
    };
    const page: number = query.number || 1;
    const limit: number = query.limit || 10;

    const data = await this.userService.findAll(filter, page, limit);
    const meta: Metadata = {
      page: page,
      limit: limit,
      total: data.total,
    };

    this.responseService.success(
      res,
      data.list,
      'Users fetched successfully',
      meta,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findOne(id);
    if (!user) {
      return this.responseService.failed(res, ['User not found'], 404);
    }
    user.password = '';

    return this.responseService.success(res, user, 'User found');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    user.password = '';
    this.responseService.success(res, user, 'User updated successfully');
  }

  @Delete(':id')
  @Roles('superadmin')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const deletedUser = await this.userService.remove(id);
    if (!deletedUser) {
      this.responseService.failed(res, ['User not found'], 404);
    } else {
      this.responseService.success(
        res,
        deletedUser,
        'User deleted successfully',
      );
    }
  }
}
