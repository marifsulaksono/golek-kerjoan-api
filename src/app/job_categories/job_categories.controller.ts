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
import { JobCategoriesService } from './job_categories.service';
import {
  CreateJobCategoryDto,
  UpdateJobCategoryDto,
} from './dto/job_category.dto';
import { Metadata, ResponseService } from 'src/shared/service/response';
import { Request, Response } from 'express';
import { Public, Roles } from 'src/shared/decorators/public.decorator';

@Controller('api/v1/job-categories')
export class JobCategoriesController {
  constructor(
    private readonly jobCategoriesService: JobCategoriesService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @Roles('superadmin,admin')
  async create(
    @Body() createJobCategoryDto: CreateJobCategoryDto,
    @Res() res: Response,
  ) {
    const job = await this.jobCategoriesService.create(createJobCategoryDto);
    this.responseService.success(res, job, 'Job category created successfully');
  }

  @Public()
  @Get()
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      search: query.search,
    };
    const page: number = parseInt(query.page) || 1;
    const limit: number = parseInt(query.limit) || 10;

    const data = await this.jobCategoriesService.findAll(filter, page, limit);
    const meta: Metadata = {
      page: page,
      limit: limit,
      total: data.total,
    };

    this.responseService.success(
      res,
      data.list,
      'Job categories fetched successfully',
      meta,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const jobCategory = await this.jobCategoriesService.findOne(id);
    if (!jobCategory) {
      return this.responseService.failed(res, ['Job category not found'], 404);
    }

    return this.responseService.success(res, jobCategory, 'Job category found');
  }

  @Put(':id')
  @Roles('superadmin,admin')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateJobCategoryDto: UpdateJobCategoryDto,
    @Res() res: Response,
  ) {
    const user = req['user'] as { sub: string };
    const jobCategory = await this.jobCategoriesService.update(
      id,
      updateJobCategoryDto,
      user.sub,
    );
    this.responseService.success(
      res,
      jobCategory,
      'Job category updated successfully',
    );
  }

  @Delete(':id')
  @Roles('superadmin,admin')
  async remove(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const user = req['user'] as { sub: string };
    const deletedJobCategory = await this.jobCategoriesService.remove(
      id,
      user.sub,
    );
    if (!deletedJobCategory) {
      this.responseService.failed(res, ['Job category not found'], 404);
    } else {
      this.responseService.success(
        res,
        deletedJobCategory,
        'Job category deleted successfully',
      );
    }
  }
}
