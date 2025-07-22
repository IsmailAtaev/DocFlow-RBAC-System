import {
  Injectable, UnauthorizedException, NotFoundException, BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from './repo';
import { RoleRepo } from 'src/roles/repo';
import { limitOffset } from 'src/shared/validation/schemas';
import { LoginDto, RegisterDto, UpdateUserRoleDto, UserQueryDto } from './dto/user.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly repo: UserRepo,
    private readonly repoRole: RoleRepo,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    try {
      const userCheck = await this.repo.findByUsername(dto.username)
      if (userCheck) throw new BadRequestException('Username already exists');

      const hashedPassword = await bcrypt.hash(dto.password, Number(process.env.HASH_SALT))

      const userRole = await this.repoRole.findRoleByCode('user')
      if (!userRole) throw new NotFoundException('Default role not found');

      const user = await this.repo.createUser({ ...dto, password: hashedPassword, role_id: userRole.id })
      if (!user) throw new InternalServerErrorException('User creation failed');

      return { id: user.id, username: user.username };
    } catch (error: any) {
      throw error
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.id, username: user.username };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    return { accessToken, username: user.username }
  }

  async authMe(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.id, username: user.username };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const userData = await this.repo.findWithPermissionsByUserId(user.id)
    if (!userData) throw new NotFoundException(`User with ID ${user.id} not found`)

    return { accessToken, ...userData, };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.repo.findByUsername(dto.username)
    if (!user) throw new UnauthorizedException('Invalid username or password');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid username or password');

    return user;
  }

  async update(dto: UpdateUserRoleDto) {
    const user = await this.repo.findById(dto.userId)
    if (!user) throw new NotFoundException('NOt found user');

    const role = await this.repoRole.findOne(dto.roleId)
    if (!role) throw new NotFoundException('NOt found role');

    const updated = await this.repo.updateRole(dto);
    if (!updated) throw new NotFoundException(`Do not change role for user with userId ${dto.userId} not found`);

    return { msg: 'successfully' };
  }

  async findAll(query: UserQueryDto) {
    const pagination = limitOffset(query);
    return this.repo.findAll({ ...query, ...pagination });
  }
}
