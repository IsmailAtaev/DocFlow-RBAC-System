import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { DocumentTypeModule } from './document-type/document-type.module';
import { DocumentModule } from './document/document.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    DatabaseModule,
    DocumentTypeModule,
    DocumentModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
  ],
})

export class AppModule { }