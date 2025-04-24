import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobCategoryDto {
  @IsNotEmpty()
  @IsString({ message: 'Please provide valid Name.' })
  name: string;
}

export class UpdateJobCategoryDto extends PartialType(CreateJobCategoryDto) {}
