import { CreatedAtQuerySchema, PaginationQuerySchema } from 'src/shared/validation/schemas';
import { z } from 'zod';

export const permissionDto = z.object({
    model: z.string().min(2, 'Model must be at least 2 characters long'),
    action: z.string().min(2, 'Action must be at least 2 characters long')
});

export type PermissionDto = z.infer<typeof permissionDto>;

export const permissionQueryDto = permissionDto
    .pick({ model: true, action: true })
    .partial()
    .merge(CreatedAtQuerySchema)
    .merge(PaginationQuerySchema);
export type PermissionQueryDto = z.infer<typeof permissionQueryDto>;