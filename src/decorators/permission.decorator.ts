import { SetMetadata } from '@nestjs/common';

export const PERMISSION_METADATA_KEY = 'permission';
export type PermissionModel = 'DOCUMENT' | 'USER' | 'ROLE' | 'PERMISSION' | 'DOCUMENT-TYPE';
export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'manage';

export const Permission = (model: PermissionModel, action: PermissionAction) =>
    SetMetadata(PERMISSION_METADATA_KEY, { model, action });