import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsersFromDB(): string {
    return 'this is users';
  }
}
