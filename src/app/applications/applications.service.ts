import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './dto/application.dto';
import { ApplicationLog } from './entities/application_logs.entity';
import { User } from '../users/entities/user.entity';
import { sendEmail } from 'src/shared/service/mail';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    private readonly dataSource: DataSource,
  ) {}

  async create(
    request: CreateApplicationDto,
    userId: string,
  ): Promise<Application> {
    return this.dataSource.transaction(async (manager) => {
      // Cek user
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');

      // Cek job
      const job = await this.jobRepository.findOneBy({ id: request.job_id });
      if (!job) throw new NotFoundException('Job not found');

      // Simpan Application baru
      const app = new Application();
      app.job_id = request.job_id;
      app.user_id = userId;
      app.status = 1; // status: applied
      app.attachment_url = request.attachment_url;
      app.created_by = userId;

      const savedApp = await manager.save(app);

      const log = new ApplicationLog();
      log.application_id = savedApp.id;
      log.status = savedApp.status;
      log.note = 'Application created by user';
      log.created_by = userId;

      await manager.save(log);

      // Update nilai applied pada Job
      await manager.increment('Job', { id: request.job_id }, 'applied', 1);

      // Kirim email ke user
      await sendEmail(
        user.email,
        'Application Submitted',
        `Hi ${user.name}, your application for job ${job.title} has been submitted.`,
        `<p>Hi <b>${user.name}</b>,</p><p>Your application for job <code>${job.title}</code> has been successfully submitted.</p>`,
      );

      return savedApp;
    });
  }

  async findAll(filter: any = {}, page: number, limit: number) {
    const queryBuilder = this.applicationRepository
      .createQueryBuilder('app')
      .select([
        'app.id',
        'app.job_id',
        'app.user_id',
        'app.status',
        'app.created_at',
        'app.updated_at',
        'app.deleted_at',
        'app.created_by',
        'app.updated_by',
        'app.deleted_by',
      ])
      .leftJoinAndSelect('app.job', 'job')
      .leftJoinAndSelect('app.user', 'user')
      .where('app.deleted_at IS NULL');

    if (filter.job_id) {
      queryBuilder.andWhere('app.job_id = :job_id', { job_id: filter.job_id });
    }
    if (filter.user_id) {
      queryBuilder.andWhere('app.user_id = :user_id', {
        user_id: filter.user_id,
      });
    }
    if (filter.search) {
      queryBuilder.andWhere(
        'job.title LIKE :search OR user.name LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
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

  findOne(id: string): Promise<Application> {
    return this.applicationRepository.findOne({
      where: { id },
      relations: ['logs', 'user'],
    });
  }

  async update(id: string, request: UpdateApplicationDto, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const app = await manager.findOne(Application, {
        where: { id },
      });

      if (!app) {
        throw new Error('Application not found');
      }

      // Update application
      app.status = request.status;
      app.updated_by = userId;
      await manager.save(Application, app);

      // Create log
      const log = manager.create(ApplicationLog, {
        application_id: id,
        status: request.status,
        note: request.note || null,
        created_by: userId,
      });

      await manager.save(ApplicationLog, log);
    });
  }

  async remove(id: string, userId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const app = await manager.findOne(Application, { where: { id } });
      if (!app) {
        return { affected: 0 };
      }

      app.deleted_by = userId;
      await manager.save(app);
      const result = await manager.softDelete(Application, id);
      return { affected: result.affected || 0 };
    });
  }
}
