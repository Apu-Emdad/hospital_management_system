import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminDTO } from 'src/admin/admin.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getUsers() {
    return this.userService.getUsersFromDB();
  }

  @Post('create-admin')
  async createAdmin(@Body() payload: AdminDTO) {
    const result = await this.userService.createAdminInDB(payload);
    return {
      status: 'success',
      message: 'Admin created successfully',
      data: result,
    };
  }
}
