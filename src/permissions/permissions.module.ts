import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionRepo } from './repo';

@Module({
  imports: [AuthModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionRepo],
})
export class PermissionsModule { }
