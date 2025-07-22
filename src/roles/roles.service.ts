import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RoleRepo } from './repo';
import { RoleDto, RoleQueryDto } from './dto/role.dto';
import { limitOffset, UUID } from 'src/shared/validation/schemas';

@Injectable()
export class RolesService {
  constructor(private readonly repo: RoleRepo) { }

  async create(dto: RoleDto) {
    const role = await this.repo.create(dto);
    if (!role) throw new InternalServerErrorException('Failed to create role');

    return role;
  }

  async update(id: UUID, dto: RoleDto) {
    const updated = await this.repo.update(id, dto)
    if (!updated) throw new NotFoundException(`Role with id ${id} not found`);

    return updated
  }

  async remove(id: UUID) {
    const deleted = await this.repo.remove(id);
    if (!deleted) throw new NotFoundException(`Role with id ${id} not found`);

    return deleted;
  }

  async findOne(id: UUID) {
    const role = await this.repo.findOne(id)
    if (!role) throw new NotFoundException('Role not found')

    return role;
  }

  async findAll(query: RoleQueryDto) {
    const pagination = limitOffset(query);
    return this.repo.findAll({ ...query, ...pagination });
  }

  async getRolePermissions(roleId: UUID) {
    const rolePermissions = await this.repo.getRolePermissions(roleId);

    if (!rolePermissions || rolePermissions.length === 0) {
      throw new NotFoundException(`No permissions found for role with id: ${roleId}`);
    }

    return rolePermissions;
  }

  async assignPermissions(roleId: UUID, permissionIds: string[]) {
    const roleExists = await this.repo.findRoleById(roleId);
    if (!roleExists) throw new NotFoundException(`Role with id ${roleId} not found`);

    const validPermissions = await this.repo.findPermissionsByIds(permissionIds);
    if (validPermissions.length !== permissionIds.length) {
      throw new BadRequestException('Some permissions are invalid');
    }

    await this.repo.clearPermissions(roleId);

    const insertData = permissionIds.map((permissionId) => ({
      role_id: roleId,
      permission_id: permissionId,
    }));

    await this.repo.addPermissions(insertData);

    return { message: 'Permissions assigned successfully' };
  }

  async findAllWithPermissions() {
    return this.repo.findAllWithPermissions()
  }
}