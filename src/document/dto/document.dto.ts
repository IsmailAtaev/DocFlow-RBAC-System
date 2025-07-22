import { CreatedAtQuerySchema, PaginationQuerySchema } from 'src/shared/validation/schemas';
import { z } from 'zod';

export const documentDto = z.object({
    documentTypeId: z.string().uuid().min(1, 'Document type ID cannot be empty'),
    name: z.string().min(1, 'Name cannot be empty'),
    path: z.string().min(1, 'Path cannot be empty'),
    userId: z.string().min(1, 'User ID cannot be empty')
});
export type DocumentDto = z.infer<typeof documentDto>;

export const documentQueryDto = z.object({
    name: z.string().optional(),
    documentType: z.string().optional()
})
    .partial()
    .merge(CreatedAtQuerySchema)
    .merge(PaginationQuerySchema);
export type DocumentQueryDto = z.infer<typeof documentQueryDto>;