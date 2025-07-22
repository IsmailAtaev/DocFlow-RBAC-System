import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepo } from './repo';
import { RoleRepo } from 'src/roles/repo';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
    }),
  ],
  providers: [AuthService, UserRepo, RoleRepo,],
  controllers: [AuthController],
  exports: [JwtModule, AuthService, UserRepo],
})

export class AuthModule { }