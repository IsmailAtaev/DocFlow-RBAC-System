import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';
import { DocumentTypeDto, documentTypeDto } from './dto/document-type.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from 'src/decorators/permission.decorator';
import { DocumentTypeQuery, documentTypeQueryDto, } from './dto/document-type.query.dto';
import { ZodPipe } from 'src/shared/validation/zod-pipe';
import { UUID, uuid } from 'src/shared/validation/schemas';


@Controller('document-type')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) { }

  @Permission('DOCUMENT-TYPE', 'create')
  @Post()
  create(@Body(new ZodPipe(documentTypeDto)) documentTypeDto: DocumentTypeDto) {
    return this.documentTypeService.create(documentTypeDto);
  }

  @Get()
  @Permission('DOCUMENT-TYPE', 'read')
  findAll(@Query(new ZodPipe(documentTypeQueryDto)) query: DocumentTypeQuery) {
    return this.documentTypeService.findAll(query);
  }

  @Permission('DOCUMENT-TYPE', 'read')
  @Get(':id')
  findOne(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.documentTypeService.findOne(id);
  }

  @Permission('DOCUMENT-TYPE', 'update')
  @Patch(':id')
  update(
    @Param('id', new ZodPipe(uuid)) id: UUID,
    @Body() updateDocumentTypeDto: DocumentTypeDto
  ) {
    return this.documentTypeService.update(id, updateDocumentTypeDto);
  }

  @Permission('DOCUMENT-TYPE', 'delete')
  @Delete(':id')
  remove(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.documentTypeService.delete(id);
  }
}