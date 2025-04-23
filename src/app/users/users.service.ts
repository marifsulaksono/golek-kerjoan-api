import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(request: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = request.email;
    user.name = request.name;
    user.phonenumber = request.phonenumber;
    user.password = await bcrypt.hash(request.password, 10);
    user.role = request.role;
    return this.userRepository.save(user);
  }

  async findAll(filter: any = {}, page: number, limit: number) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.phonenumber',
        'user.role',
        'user.created_at',
        'user.updated_at',
        'user.deleted_at',
        'user.created_by',
        'user.updated_by',
        'user.deleted_by',
      ]);
    if (filter.search) {
      queryBuilder.where('user.name LIKE :search OR user.email LIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const links = [];
    const totalPages = Math.ceil(total / limit);

    for (let i = 1; i <= totalPages; i++) {
      links.push(
        `http://localhost:3000/api/v1/users?sort=user_auth.id%20DESC&page=${i}`,
      );
    }
    return {
      list: users,
      total: total,
    };
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.email = :email', { email: email });
    return queryBuilder.getOne();
  }

  async update(id: string, request: UpdateUserDto): Promise<User | null> {
    console.log(request);
    console.log('ID: ', id);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      console.log('User not found');
      return null;
    }
    console.log('mendapatkan data user');
    console.log(user);
    Object.assign(user, request);
    return this.userRepository.save(user);
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.userRepository.softDelete(id);
  }
}
