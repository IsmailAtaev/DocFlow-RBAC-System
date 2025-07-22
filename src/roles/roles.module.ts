import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RoleRepo } from './repo';

@Module({
  imports: [AuthModule],
  controllers: [RolesController],
  providers: [RolesService, RoleRepo],
  exports: [RoleRepo]
})

export class RolesModule { }