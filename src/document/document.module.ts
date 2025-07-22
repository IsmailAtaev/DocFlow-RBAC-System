import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { AuthModule } from '../auth/auth.module';
import { DocumentRepo } from './repo';

@Module({
  imports: [AuthModule],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepo],
})

export class DocumentModule { }