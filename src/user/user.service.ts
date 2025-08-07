// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { AdminDTO } from 'src/admin/admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getUsersFromDB(): string {
    return 'this is users';
  }

  async createAdminInDB(payload: AdminDTO) {
    const { admin_role, ...userData } = payload;

    const transactionCallback = async () => {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          birth_date: new Date(userData.birth_date),
        },
      });

      const admin = await this.prisma.admin.create({
        data: {
          user_id: user.id,
          admin_role: admin_role,
        },
      });

      return { user, admin };
    };

    const result = await this.prisma.$transaction(transactionCallback);

    return result;
  }
}
