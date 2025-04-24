import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobCategory } from './entities/job_category.entity';
import { Repository } from 'typeorm';
import {
  CreateJobCategoryDto,
  UpdateJobCategoryDto,
} from './dto/job_category.dto';

@Injectable()
export class JobCategoriesService {
  constructor(
    @InjectRepository(JobCategory)
    private readonly jobCategoryRepository: Repository<JobCategory>,
  ) {}

  create(request: CreateJobCategoryDto): Promise<JobCategory> {
    const jobCategory: JobCategory = new JobCategory();
    jobCategory.name = request.name;
    return this.jobCategoryRepository.save(jobCategory);
  }

  async findAll(filter: any = {}, page: number, limit: number) {
    const queryBuilder = this.jobCategoryRepository
      .createQueryBuilder('job_category')
      .select([
        'job_category.id',
        'job_category.name',
        'job_category.created_at',
        'job_category.updated_at',
        'job_category.deleted_at',
        'job_category.created_by',
        'job_category.updated_by',
        'job_category.deleted_by',
      ]);
    if (filter.search) {
      queryBuilder.where('job_category.name LIKE :search', {
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

  findOne(id: string): Promise<JobCategory> {
    return this.jobCategoryRepository.findOneBy({ id });
  }

  async update(
    id: string,
    request: UpdateJobCategoryDto,
  ): Promise<JobCategory | null> {
    const user = await this.jobCategoryRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    Object.assign(user, request);
    return this.jobCategoryRepository.save(user);
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.jobCategoryRepository.softDelete(id);
  }
}
