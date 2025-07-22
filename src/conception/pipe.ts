import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIntPipeMe implements PipeTransform<string, number> {
    transform(value: string): number {
        const val = parseInt(value);
        if (isNaN(val)) throw new BadRequestException('Invalide value');
        return val
    }
}