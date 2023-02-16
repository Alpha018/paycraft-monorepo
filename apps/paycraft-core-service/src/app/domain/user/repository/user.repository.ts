import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(
    private prisma: PrismaService
  ) {}

  createUser(user: Partial<User>) {
    return this.prisma.user.create({
      data: {
        firebaseUid: user.firebaseUid,
        roles: user.roles
      }
    })
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  getUserByFirebaseUid(uid: string) {
    return this.prisma.user.findUnique({
      where: {
        firebaseUid: uid
      }
    })
  }
}
