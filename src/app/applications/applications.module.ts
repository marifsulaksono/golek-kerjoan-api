import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationLog } from './entities/application_logs.entity';
import { ResponseService } from 'src/shared/service/response';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, ApplicationLog, User, Job])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ResponseService],
})
export class ApplicationsModule {}
