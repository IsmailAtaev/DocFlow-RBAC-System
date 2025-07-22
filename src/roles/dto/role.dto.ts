import { CreatedAtQuerySchema, PaginationQuerySchema } from 'src/shared/validation/schemas';
import { z } from 'zod';

export const assignPermissionsDto = z.object({
    permissionIds: z.array(z.string().uuid()).nonempty('Permission IDs array cannot be empty')
});
export type AssignPermissionsDto = z.infer<typeof assignPermissionsDto>;

export const roleDto = z.object({
    code: z.string().min(3, 'Code must be at least 3 characters long'),
    name: z.string().min(3, 'Name must be at least 3 characters long')
});
export type RoleDto = z.infer<typeof roleDto>;

export const roleQueryDto = roleDto
    .pick({ code: true, name: true })
    .partial()
    .merge(CreatedAtQuerySchema)
    .merge(PaginationQuerySchema);
export type RoleQueryDto = z.infer<typeof roleQueryDto>;