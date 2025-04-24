import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationLog } from './entities/application_logs.entity';
import { ResponseService } from 'src/shared/service/response';

@Module({
  imports: [TypeOrmModule.forFeature([Application, ApplicationLog])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ResponseService],
})
export class ApplicationsModule {}
