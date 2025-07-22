import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionDto, PermissionQueryDto } from './dto/permission.dto';
import { PermissionRepo } from './repo';
import { limitOffset } from 'src/shared/validation/schemas';

@Injectable()
export class PermissionsService {
  constructor(private repo: PermissionRepo) { }

  async create(dto: PermissionDto) {
    const result = await this.repo.create(dto)
    if (!result) throw new Error('Failed to create permission');

    return result
  }

  async update(id: string, dto: PermissionDto) {
    const result = await this.repo.update(id, dto);
    if (!result) throw new NotFoundException(`Permission with id ${id} not found`);

    return result
  }

  async remove(id: string) {
    const deleted = await this.repo.remove(id);
    if (!deleted) throw new NotFoundException(`Permission with id ${id} not found`);

    return { message: 'Deleted' };
  }

  async findOne(id: string) {
    const permission = await this.repo.findOne(id)
    if (!permission) throw new NotFoundException('Permission not found');

    return permission;
  }

  async findAll(query: PermissionQueryDto) {
    const pagination = limitOffset(query);
    return this.repo.findAll({ ...query, ...pagination });
  }
}