import { z } from 'zod';
import { isDate } from 'node:util/types';

export const uuid = z.string().uuid().brand<'UUID'>();
export type UUID = z.infer<typeof uuid>;

export const strDate = z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => isDate(val), { message: 'Must be a valid ISO date', });

export const CreatedAtQuerySchema = z.object({
    createdFrom: strDate.optional(),
    createdTo: strDate.optional(),
});

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(100),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const limitOffset = (d: PaginationQuery) => ({
    offset: (d.page - 1) * d.perPage,
    limit: d.perPage,
});
export type LimitOffset = { limit: number; offset: number };  