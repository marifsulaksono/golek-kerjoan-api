import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../../../shared/enum/user-role';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'Please provide valid Name.' })
  name: string;

  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @IsString({ message: 'Please provide valid Name.' })
  @MaxLength(15, { message: 'Maximum 15 characters allowed' })
  phonenumber: string;

  @IsEnum(UserRole, { message: 'Please provide valid Role.' })
  role: UserRole;
}

export class CreateUserDto extends PartialType(UpdateUserDto) {
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
  })
  password: string;
}
