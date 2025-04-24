import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
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

    return {
      list: users,
      total: total,
    };
  }

  async findOne(id: string): Promise<User & { total_applied: number }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.applications', 'app', 'app.deleted_at IS NULL')
      .where('user.id = :id', { id })
      .loadRelationCountAndMap(
        'user.total_applied',
        'user.applications',
        'app',
        (qb) => qb.andWhere('app.deleted_at IS NULL'),
      )
      .getOne();

    return user as User & { total_applied: number };
  }

  findOneByEmail(email: string): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.email = :email', { email: email });
    return queryBuilder.getOne();
  }

  async update(
    id: string,
    request: UpdateUserDto,
    userId: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    user.updated_by = userId;
    Object.assign(user, request);
    return this.userRepository.save(user);
  }

  async remove(id: string, userId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id } });
      if (!user) {
        return { affected: 0 };
      }

      user.deleted_by = userId;
      await manager.save(user);
      const result = await manager.softDelete(User, id);
      return { affected: result.affected || 0 };
    });
  }
}
