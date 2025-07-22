import { Controller, Post, Get, Param, Patch, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { assignPermissionsDto, AssignPermissionsDto, RoleDto, roleDto, roleQueryDto, RoleQueryDto } from './dto/role.dto';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from 'src/decorators/permission.decorator';
import { uuid, UUID } from 'src/shared/validation/schemas';
import { ZodPipe } from 'src/shared/validation/zod-pipe';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @Permission('ROLE', 'create')
  create(@Body(new ZodPipe(roleDto)) dto: RoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(':id')
  @Permission('ROLE', 'update')
  update(
    @Param('id', new ZodPipe(uuid)) id: UUID,
    @Body(new ZodPipe(roleDto)) dto: RoleDto
  ) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @Permission('ROLE', 'delete')
  remove(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.rolesService.remove(id);
  }

  @Get()
  @Permission('ROLE', 'read')
  findAll(@Query(new ZodPipe(roleQueryDto)) query: RoleQueryDto) {
    return this.rolesService.findAll(query);
  }

  @Get('with-permissions')
  @Permission('ROLE', 'read')
  findAllWithPermissions() {
    return this.rolesService.findAllWithPermissions();
  }

  @Get(':id')
  @Permission('ROLE', 'read')
  findOne(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.rolesService.findOne(id);
  }

  @Get(':id/permissions')
  @Permission('ROLE', 'read')
  getRolePermissions(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.rolesService.getRolePermissions(id);
  }

  @Post(':id/permissions')
  @Permission('ROLE', 'create')
  assignPermissionsToRole(
    @Param('id', new ZodPipe(uuid)) roleId: UUID,
    @Body(new ZodPipe(assignPermissionsDto)) dto: AssignPermissionsDto
  ) {
    return this.rolesService.assignPermissions(roleId, dto.permissionIds);
  }
}