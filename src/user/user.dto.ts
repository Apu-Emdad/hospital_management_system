import {
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
  Length,
} from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  STAFF = 'STAFF',
  PATIENT = 'PATIENT',
}

export class UserDto {
  @IsString({ message: 'Name must be a string.' })
  @Length(2, 255, { message: 'Name must be between 2 and 255 characters.' })
  name: string;

  @IsEnum(Role, { message: 'Role must be a valid enum value.' })
  role: Role;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @Length(6, 255, { message: 'Password must be between 6 and 255 characters.' })
  password: string;

  @IsString({ message: 'Phone must be a string.' })
  @Length(7, 14, { message: 'Phone must be between 7 and 14 characters.' })
  phone: string;

  @IsEnum(Gender, { message: 'Gender must be a valid enum value.' })
  gender: Gender;

  @IsString({ message: 'Address must be a string.' })
  @Length(5, 255, { message: 'Address must be between 5 and 255 characters.' })
  address: string;

  @IsDateString()
  birth_date: string;
}
