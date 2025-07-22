import { Module } from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';
import { DocumentTypeController } from './document-type.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DocumentTypeRepo } from './repo';

@Module({
  imports: [AuthModule],
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService, DocumentTypeRepo],
})

export class DocumentTypeModule { }