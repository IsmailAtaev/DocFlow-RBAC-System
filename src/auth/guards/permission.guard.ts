import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { PERMISSION_METADATA_KEY } from '../../decorators/permission.decorator';
import { UserRepo } from '../repo';

interface PermissionMetadata {
    model: string;
    action: string;
}

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly repo: UserRepo
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { model, action } = this.reflector.get<PermissionMetadata>(PERMISSION_METADATA_KEY, context.getHandler()) || {};

        if (!model || !action) return true;

        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;

        const user = await this.repo.findById(userId);
        if (!user) throw new UnauthorizedException('User not found');

        const checkUserPermission: boolean = await this.repo.checkUserPermission(userId, model, action);
        if (!checkUserPermission) throw new ForbiddenException('Permissions not found');

        request.user = { id: user.id, username: user.username }
        return true;
    }
}