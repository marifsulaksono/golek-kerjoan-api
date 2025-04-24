import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Metadata, ResponseService } from 'src/shared/service/response';
import { Public, Roles } from 'src/shared/decorators/public.decorator';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { Request, Response } from 'express';

@Controller('api/v1/jobs')
export class JobsController {
  constructor(
    private readonly jobService: JobsService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @Roles('superadmin,admin')
  async create(@Body() createJobDto: CreateJobDto, @Res() res: Response) {
    const user = await this.jobService.create(createJobDto);
    this.responseService.success(res, user, 'Job created successfully');
  }

  @Public()
  @Get()
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      search: query.search,
    };
    const page: number = parseInt(query.page) || 1;
    const limit: number = parseInt(query.limit) || 10;

    const data = await this.jobService.findAll(filter, page, limit);
    const meta: Metadata = {
      page: page,
      limit: limit,
      total: data.total,
    };

    this.responseService.success(
      res,
      data.list,
      'Jobs fetched successfully',
      meta,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const job = await this.jobService.findOne(id);
    if (!job) {
      return this.responseService.failed(res, ['Job not found'], 404);
    }

    return this.responseService.success(res, job, 'Job found');
  }

  @Put(':id')
  @Roles('superadmin,admin')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Res() res: Response,
  ) {
    const user = req['user'] as { sub: string };
    const job = await this.jobService.update(id, updateJobDto, user.sub);
    this.responseService.success(res, job, 'Job category updated successfully');
  }

  @Delete(':id')
  @Roles('superadmin,admin')
  async remove(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const user = req['user'] as { sub: string };
    const deletedJob = await this.jobService.remove(id, user.sub);
    if (!deletedJob) {
      this.responseService.failed(res, ['Job not found'], 404);
    } else {
      this.responseService.success(res, deletedJob, 'Job deleted successfully');
    }
  }
}
