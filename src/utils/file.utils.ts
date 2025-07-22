import * as fs from 'fs/promises';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';

export async function removeFile(myPath: string, relativePath: string) {
    try {
        const fullPath = path.join(process.cwd(), myPath, relativePath);
        await fs.unlink(fullPath);
    } catch (err: any) {
        if (err.code !== 'ENOENT') {
            throw new InternalServerErrorException(`Failed to delete file: ${relativePath}`);
        }
    }
}
