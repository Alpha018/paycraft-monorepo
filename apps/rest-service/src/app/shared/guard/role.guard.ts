import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { userRole } from '../../domain/proto-gen/response/user';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<userRole[]>(
      'roles',
      context.getHandler()
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const dbUser = (request as Request).user.database;

    if (!dbUser) {
      return false;
    }

    const userRoles = dbUser.roles;
    const requiredRoles = new Set(roles);

    return userRoles.some((role) => requiredRoles.has(role));
  }
}
