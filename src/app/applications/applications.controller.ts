import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './dto/application.dto';
import { Roles } from 'src/shared/decorators/public.decorator';
import { Metadata, ResponseService } from 'src/shared/service/response';
import { Request, Response } from 'express';

@Controller('api/v1/applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @Roles('user')
  async create(
    @Req() req: Request,
    @Body() ceateApplicationDto: CreateApplicationDto,
    @Res() res: Response,
  ) {
    const user = req['user'] as { sub: string };
    const data = await this.applicationsService.create(
      ceateApplicationDto,
      user.sub,
    );
    this.responseService.success(res, data, 'Application created successfully');
  }

  @Get('all')
  @Roles('superadmin,admin')
  async findAll(@Res() res: Response, @Query() query: any) {
    const filter = {
      search: query.search,
    };
    const page: number = parseInt(query.page) || 1;
    const limit: number = parseInt(query.limit) || 10;

    const data = await this.applicationsService.findAll(filter, page, limit);
    const meta: Metadata = {
      page: page,
      limit: limit,
      total: data.total,
    };

    this.responseService.success(
      res,
      data.list,
      'Applications fetched successfully',
      meta,
    );
  }

  @Get('')
  @Roles('user')
  async findAllByUser(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const user = req['user'] as { sub: string };
    const filter = {
      search: query.search,
      user_id: user.sub,
    };
    const page: number = parseInt(query.page) || 1;
    const limit: number = parseInt(query.limit) || 10;

    const data = await this.applicationsService.findAll(filter, page, limit);
    const meta: Metadata = {
      page: page,
      limit: limit,
      total: data.total,
    };

    this.responseService.success(
      res,
      data.list,
      'Applications fetched successfully',
      meta,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const app = await this.applicationsService.findOne(id);
    if (!app) {
      return this.responseService.failed(res, ['application not found'], 404);
    }

    return this.responseService.success(res, app, 'application found');
  }

  @Put(':id')
  @Roles('superadmin,admin')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Res() res: Response,
  ) {
    const user = req['user'] as { sub: string };
    const app = await this.applicationsService.update(
      id,
      updateApplicationDto,
      user.sub,
    );
    this.responseService.success(res, app, 'Application updated successfully');
  }

  @Delete(':id')
  @Roles('superadmin,admin')
  async remove(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const user = req['user'] as { sub: string };
    const deletedApp = await this.applicationsService.remove(id, user.sub);
    if (!deletedApp) {
      this.responseService.failed(res, ['Application not found'], 404);
    } else {
      this.responseService.success(
        res,
        deletedApp,
        'Application deleted successfully',
      );
    }
  }
}
