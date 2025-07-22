import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DocumentRepo } from './repo';
import { removeFile } from 'src/utils/file.utils';
import { DocumentDto, DocumentQueryDto } from './dto/document.dto';
import { limitOffset } from 'src/shared/validation/schemas';

@Injectable()
export class DocumentService {
  constructor(private repo: DocumentRepo) { }

  async create(dto: DocumentDto) {
    return this.repo.createOne(dto);
  }

  async update(id: string, dto: DocumentDto, file?: Express.Multer.File) {
    try {
      const existing = await this.repo.findOne(id);
      if (!existing) throw new NotFoundException(`Document with id ${id} not found`);

      if (file) {
        await removeFile('public/uploads', existing.path);
        dto.path = file.filename;
      }

      const updated = await this.repo.update(id, dto)
      if (!updated) throw new InternalServerErrorException('Failed to update document');

      return updated;
    } catch (error) {
      if (file) await removeFile('public/uploads', file.filename);

      throw error;
    }
  }

  async delete(id: string) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new InternalServerErrorException('Failed to delete document from database');

    await removeFile('public/uploads', deleted.path);
    return deleted;
  }

  async findOne(id: string) {
    const document = await this.repo.findOne(id);
    if (!document) throw new NotFoundException(`Document with id ${id} not found`)

    return document;
  }

  async findDocumentsByUserId(userId: string) {
    return this.repo.findDocumentsByUserId(userId)
  }

  async findAll(query: DocumentQueryDto) {
    const pagination = limitOffset(query);
    return this.repo.findAll({ ...query, ...pagination });
  }
}