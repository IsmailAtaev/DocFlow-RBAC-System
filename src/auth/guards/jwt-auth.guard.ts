import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) throw new UnauthorizedException('No authorization header');

        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });

            request.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid token')
        }
    }
}