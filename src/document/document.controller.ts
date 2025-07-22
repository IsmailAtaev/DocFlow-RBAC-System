import { Controller, Post, Get, Patch, Delete, Param, UploadedFile, UseInterceptors, Body, UseGuards, Query, } from '@nestjs/common'
import { DocumentService } from './document.service'
import { multerFileInterceptor } from './multer.config'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/auth.decorator'
import { PermissionGuard } from 'src/auth/guards/permission.guard'
import { Permission } from 'src/decorators/permission.decorator'
import { documentDto, DocumentDto, documentQueryDto, DocumentQueryDto } from './dto/document.dto'
import { ZodPipe } from 'src/shared/validation/zod-pipe'
import { uuid, UUID } from 'src/shared/validation/schemas'

type UploadedFileWithPath = Express.Multer.File & {
  path: string
  filename: string
}

@Controller('documents')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

  @Permission('DOCUMENT', 'create')
  @UseInterceptors(multerFileInterceptor)
  @Post()
  async create(
    @UploadedFile() file: UploadedFileWithPath,
    @Body(new ZodPipe(documentDto.omit({ path: true, userId: true }))) dto: Omit<DocumentDto, 'path' | 'userId'>,
    @User('id') userId: UUID
  ) {
    return this.documentService.create({
      ...dto,
      path: file.filename,
      userId
    })
  }

  @Permission('DOCUMENT', 'update')
  @UseInterceptors(multerFileInterceptor)
  @Patch(':id')
  async update(
    @Param('id', new ZodPipe(uuid)) id: UUID,
    @UploadedFile() file: UploadedFileWithPath | undefined,
    @Body() dto: DocumentDto,
  ) {
    return this.documentService.update(id, dto, file)
  }

  @Permission('DOCUMENT', 'delete')
  @Delete(':id')
  async remove(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.documentService.delete(id)
  }

  @Permission('DOCUMENT', 'read')
  @Get('me')
  async findDocumentsByUserId(@User('id') userId: UUID) {
    return this.documentService.findDocumentsByUserId(userId)
  }

  @Permission('DOCUMENT', 'read')
  @Get(':id')
  async findOne(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.documentService.findOne(id)
  }

  @Permission('DOCUMENT', 'read')
  @Get()
  async findAll(@Query(new ZodPipe(documentQueryDto)) query: DocumentQueryDto) {
    return this.documentService.findAll(query)
  }
}