import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Query, ParseUUIDPipe, } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from 'src/decorators/permission.decorator';
import { ZodPipe } from 'src/shared/validation/zod-pipe';
import { PermissionDto, permissionDto, permissionQueryDto, PermissionQueryDto } from './dto/permission.dto';
import { UUID, uuid } from 'src/shared/validation/schemas';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PermissionsController {
  constructor(private readonly service: PermissionsService) { }

  @Post()
  @Permission('PERMISSION', 'create')
  create(@Body(new ZodPipe(permissionDto)) dto: PermissionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Permission('PERMISSION', 'update')
  update(
    @Param('id', new ZodPipe(uuid)) id: UUID,
    @Body(new ZodPipe(permissionDto)) dto: PermissionDto
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permission('PERMISSION', 'delete')
  remove(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.service.remove(id);
  }

  @Get(':id')
  @Permission('PERMISSION', 'read')
  findOne(@Param('id', new ZodPipe(uuid)) id: UUID) {
    return this.service.findOne(id);
  }

  @Get()
  @Permission('PERMISSION', 'read')
  findAll(@Query(new ZodPipe(permissionQueryDto)) query: PermissionQueryDto) {
    return this.service.findAll(query);
  }
}