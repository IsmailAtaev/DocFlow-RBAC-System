import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodFilter implements ExceptionFilter {
    catch(exception: ZodError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const errors = exception.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        }));

        const status: number = 400;

        response.status(status).json({
            status,
            message: 'VALIDATION_FAILED',
            errors,
        });
    }
}