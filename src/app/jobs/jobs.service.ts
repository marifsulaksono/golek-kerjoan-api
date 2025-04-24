import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { RedisService } from 'src/shared/service/redis';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  create(request: CreateJobDto): Promise<Job> {
    const job: Job = new Job();
    job.title = request.title;
    job.description = request.description;
    job.image_url = request.image_url;
    job.status = request.status;
    job.category_id = request.category_id;
    return this.jobRepository.save(job);
  }

  async findAll(filter: any = {}, page: number, limit: number) {
    // Cek data di redis
    const cacheKey = `jobs:search:${filter.search || ''}:page:${page}:limit:${limit}`;
    const cached = await this.redisService.get<{ list: any[]; total: number }>(
      cacheKey,
    );

    if (cached) {
      console.log('================>> Data dari redis <<================');
      return cached;
    }

    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .select([
        'job.id',
        'job.title',
        'job.description',
        'job.image_url',
        'job.status',
        'job.applied',
        'job.category_id',
        'job.created_at',
        'job.updated_at',
        'job.deleted_at',
        'job.created_by',
        'job.updated_by',
        'job.deleted_by',
      ])
      .leftJoinAndSelect('job.category', 'category')
      .where('job.deleted_at IS NULL');

    if (filter.search) {
      queryBuilder.andWhere('job.title LIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    const [jobs, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = { list: jobs, total };
    const TTL = 60; // set TTL (time to live)
    await this.redisService.set(cacheKey, result, TTL); // store data ke redis
    return result;
  }

  findOne(id: string): Promise<Job> {
    return this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.category', 'category')
      .where('job.id = :id', { id })
      .andWhere('job.deleted_at IS NULL')
      .getOne();
  }

  async update(
    id: string,
    request: UpdateJobDto,
    userId: string,
  ): Promise<Job | null> {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) {
      return null;
    }
    job.updated_by = userId;
    Object.assign(job, request);
    return this.jobRepository.save(job);
  }

  async remove(id: string, userId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const job = await manager.findOne(Job, { where: { id } });
      if (!job) {
        return { affected: 0 };
      }

      job.deleted_by = userId;
      await manager.save(job);
      const result = await manager.softDelete(Job, id);
      return { affected: result.affected || 0 };
    });
  }
}
