import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { DocumentTypeRepo } from './repo'
import { DocumentTypeDto } from './dto/document-type.dto'
import { DocumentTypeQuery } from './dto/document-type.query.dto';
import { limitOffset, UUID } from 'src/shared/validation/schemas';

@Injectable()
export class DocumentTypeService {
  constructor(private repo: DocumentTypeRepo) { }

  async create(dto: DocumentTypeDto) {
    try {
      return await this.repo.create(dto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create document type';
      throw new BadRequestException(message);
    }
  }

  async update(id: UUID, updateDocumentTypeDto: DocumentTypeDto) {
    const updated = await this.repo.update(id, updateDocumentTypeDto);
    if (!updated) throw new NotFoundException(`DocumentType with id ${id} not found`);

    return updated;
  }

  async delete(id: UUID) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException(`DocumentType with id ${id} not found`);

    return deleted;
  }

  async findOne(id: UUID) {
    const result = await this.repo.findOne(id)
    if (!result) throw new NotFoundException(`Document type with id ${id} not found`)

    return result;
  }

  async findAll(query: DocumentTypeQuery) {
    const pagination = limitOffset(query);
    return this.repo.findAll({ ...query, ...pagination });
  }
}