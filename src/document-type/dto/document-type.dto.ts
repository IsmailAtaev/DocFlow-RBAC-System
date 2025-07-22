import { z } from 'zod';

export const documentTypeDto = z
    .object({
        type: z.string().min(1, 'Type cannot be empty').max(255, 'Type can then 255')
    });
export type DocumentTypeDto = z.infer<typeof documentTypeDto>;