import { z } from 'zod';
import { CreatedAtQuerySchema, PaginationQuerySchema } from "src/shared/validation/schemas";

export const documentTypeQueryDto = z
    .object({
        type: z.string().optional()
    })
    .merge(CreatedAtQuerySchema)
    .merge(PaginationQuerySchema);

export type DocumentTypeQuery = z.infer<typeof documentTypeQueryDto>;