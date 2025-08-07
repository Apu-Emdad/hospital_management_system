import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from 'src/config';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(BCRYPT_SALT_ROUNDS),
    );

    req.body.password = hashedPassword;

    next();
  }
}
