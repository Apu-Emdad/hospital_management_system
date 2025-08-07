import { IsEnum } from 'class-validator';
import { UserDto } from 'src/user/user.dto';

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  DEV = 'DEV',
}

export class AdminDTO extends UserDto {
  @IsEnum(AdminRole, { message: 'Provide valid Role' })
  admin_role: AdminRole;
}
