import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerFileInterceptor = FileInterceptor('file', {
    storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now();
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    }),
});