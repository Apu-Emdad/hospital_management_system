import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() payload: AuthDTO) {
    const result = await this.authService.loginUser(payload);
    return {
      status: 'success',
      message: 'Logged In successfully',
      data: result,
    };
  }
}
