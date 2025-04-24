import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString({ message: 'Please provide valid Job ID.' })
  job_id: string;

  @IsNotEmpty()
  @IsString({ message: 'Please provide valid Attachment URL.' })
  attachment_url: string;
}

export class UpdateApplicationDto {
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsString()
  note: string;
}
