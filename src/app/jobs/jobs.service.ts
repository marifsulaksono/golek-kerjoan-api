import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
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

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      list: users,
      total: total,
    };
  }

  findOne(id: string): Promise<Job> {
    return this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.category', 'category')
      .where('job.id = :id', { id })
      .andWhere('job.deleted_at IS NULL')
      .getOne();
  }

  async update(id: string, request: UpdateJobDto): Promise<Job | null> {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) {
      return null;
    }
    Object.assign(job, request);
    return this.jobRepository.save(job);
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.jobRepository.softDelete(id);
  }
}
