import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// проверяет токен, валиден или нет

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) throw new UnauthorizedException('ACCESS_TOKEN_SECRET is not set');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.userId, username: payload.username };
    }
}