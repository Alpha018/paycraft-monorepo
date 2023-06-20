import { SetMetadata } from '@nestjs/common';
import { userRole } from '../../domain/proto-gen/response/user';

export const RolesGuard = (...roles: userRole[]) =>
  SetMetadata('roles', roles);
