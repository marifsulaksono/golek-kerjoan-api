import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString({ message: 'Please provide valid Title.' })
  title: string;

  @IsString({ message: 'Please provide valid Description.' })
  description: string;

  @IsString({ message: 'Please provide valid Image URL.' })
  image_url: string;

  @IsNotEmpty()
  @IsEnum(['closed', 'open'], { message: 'Please provide valid Status.' })
  status: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;
}

export class UpdateJobDto extends PartialType(CreateJobDto) {}
