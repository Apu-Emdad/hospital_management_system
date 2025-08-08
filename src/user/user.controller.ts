import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminDTO } from 'src/admin/admin.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  getUsers(@Req() req) {
    // console.log(req.user);
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
