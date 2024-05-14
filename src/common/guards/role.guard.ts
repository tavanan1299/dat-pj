import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KEY_PERMISSION } from '../constants/constant';
import { PERMISSIONS } from '../constants/permission.constant';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	canActivate(context: ExecutionContext): boolean {
		const cls = context.getClass();
		const handler = context.getHandler();

		const action = this.reflector.getAllAndOverride<string>(KEY_PERMISSION, [handler, cls]);

		if (!action) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();

		const permissions = user.role.permissions.map((per) => per.permission);

		if (permissions.includes(PERMISSIONS.ADMIN) || permissions.includes(action)) return true;

		throw new ForbiddenException('Permission denied!');
	}
}
