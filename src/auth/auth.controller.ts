import { Controller, Post, Body, UseGuards, Get, Query, Put, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Permission } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { ZodPipe } from 'src/shared/validation/zod-pipe';
import {
  loginDto, LoginDto, registerDto, RegisterDto, updateUserRoleDto,
  UpdateUserRoleDto, UserQueryDto, userQueryDto
} from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body(new ZodPipe(registerDto)) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body(new ZodPipe(loginDto)) dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('me')
  async authMe(@Body(new ZodPipe(loginDto)) dto: LoginDto) {
    return this.authService.authMe(dto)
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permission('USER', 'update')
  @Put('role')
  update(@Body(new ZodPipe(updateUserRoleDto)) dto: UpdateUserRoleDto) {
    return this.authService.update(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permission('USER', 'read')
  @Get('users')
  async findAll(@Query(new ZodPipe(userQueryDto)) query: UserQueryDto) {
    return this.authService.findAll(query)
  }
}