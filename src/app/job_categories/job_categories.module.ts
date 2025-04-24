import { Module } from '@nestjs/common';
import { JobCategoriesService } from './job_categories.service';
import { JobCategoriesController } from './job_categories.controller';
import { JobCategory } from './entities/job_category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from 'src/shared/service/response';

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory])],
  controllers: [JobCategoriesController],
  providers: [JobCategoriesService, ResponseService],
})
export class JobCategoriesModule {}
