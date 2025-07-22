import { CreatedAtQuerySchema, PaginationQuerySchema } from "src/shared/validation/schemas";
import z from "zod";

const userDto = z.object({
    userId: z.string().uuid().min(1, 'User ID cannot be empty'),
    username: z.string().trim().min(4, 'username can be more 4 simbol').max(255),
    password: z.string().trim().min(6, 'password be more 6 simbol').max(255),
    fullname: z.string().min(4, 'fullname cannot be empty'),
    active: z.boolean().default(true),
    roleId: z.string().uuid().min(1, 'Document type ID cannot be empty'),
    roleCode: z.string().min(1, 'roleCode cannot be empty'),
});

export const loginDto = userDto.pick({
    username: true,
    password: true
})
export type LoginDto = z.infer<typeof loginDto>;

export const registerDto = userDto.pick({
    username: true,
    password: true,
    fullname: true
})
export type RegisterDto = z.infer<typeof registerDto>;

export const updateUserRoleDto = userDto.pick({
    userId: true,
    roleId: true
})
export type UpdateUserRoleDto = z.infer<typeof updateUserRoleDto>;

export const userQueryDto = userDto.pick({
    fullname: true,
    active: true,
    roleCode: true
})
    .partial()
    .merge(CreatedAtQuerySchema)
    .merge(PaginationQuerySchema);
export type UserQueryDto = z.infer<typeof userQueryDto>;