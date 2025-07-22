import { KyselyService } from '../db/kysely.service'
import { Insertable, sql, } from 'kysely';
import { jsonArrayFrom, } from 'kysely/helpers/postgres';
import { Injectable } from '@nestjs/common'
import { ConstantsDb } from '../db/constants-db'
import { DB } from 'src/db/types';
import { getDateRange } from 'src/shared/utils/date-range';
import { UpdateUserRoleDto, UserQueryDto } from './dto/user.dto';
import { LimitOffset } from 'src/shared/validation/schemas';

const tableName = ConstantsDb.USERS;

@Injectable()
export class UserRepo {
    constructor(private kysely: KyselyService) { }

    async createUser(newUser: Insertable<DB['users']>) {
        return await this.kysely.db
            .insertInto(tableName)
            .values(newUser)
            .returningAll()
            .executeTakeFirst();
    }

    async updateRole(dto: UpdateUserRoleDto) {
        return await this.kysely.db
            .updateTable(tableName)
            .set({ role_id: dto.roleId })
            .where('id', '=', dto.userId)
            .returningAll()
            .executeTakeFirst();
    }

    async findById(id: string) {
        return await this.kysely.db
            .selectFrom(tableName)
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
    }

    async findByUsername(username: string) {
        return await this.kysely.db
            .selectFrom(tableName)
            .selectAll()
            .where('username', '=', username)
            .executeTakeFirst();
    }

    async checkUserPermission(id: string, model: string, action: string): Promise<boolean> {
        const havePermission = await this.kysely.db
            .selectFrom(tableName)
            .innerJoin('roles', 'roles.id', 'users.role_id')
            .innerJoin('role_permissions', 'role_permissions.role_id', 'roles.id')
            .innerJoin('permissions', 'permissions.id', 'role_permissions.permission_id')
            .where('users.id', '=', id)
            .where('permissions.model', '=', model)
            .where('permissions.action', '=', action)
            .select('users.id')
            .executeTakeFirst();

        return !!havePermission;
    }

    async findWithPermissionsByUserId(userId: string) {
        return await this.kysely.db
            .selectFrom('users')
            .innerJoin('roles', 'roles.id', 'users.role_id')
            .select((eb) => [
                'users.id as id',
                'users.username as username',
                'users.fullname as fullname',
                'users.active as active',
                'users.createdAt as createdAt',
                'roles.code as role',
                jsonArrayFrom(
                    eb
                        .selectFrom('role_permissions')
                        .innerJoin('permissions', 'permissions.id', 'role_permissions.permission_id')
                        .select([
                            sql`permissions.model`.as('model'),
                            sql`permissions.action`.as('action'),
                        ])
                        .whereRef('role_permissions.role_id', '=', 'roles.id')
                ).as('permissions'),
            ])
            .where('users.id', '=', userId)
            .executeTakeFirst();
    }

    async findAll(query: UserQueryDto & LimitOffset) {
        const { fromDate, toDate } = getDateRange(query.createdFrom, query.createdTo);

        let q = this.kysely.db.selectFrom('users').innerJoin('roles', 'users.role_id', 'roles.id');

        if (query.fullname) q = q.where('users.fullname', '=', query.fullname);
        if (query.active !== undefined) q = q.where('users.active', '=', query.active);
        if (query.roleCode) q = q.where('roles.code', '=', query.roleCode);
        if (fromDate) q = q.where('users.createdAt', '>=', fromDate);
        if (toDate) q = q.where('users.createdAt', '<=', toDate);

        const total = await q.select((eb) => eb.fn.countAll().as('count')).executeTakeFirst();

        const data = await q
            .select([
                'users.id',
                'users.username',
                'users.fullname',
                'users.active',
                'users.createdAt',
                'roles.name as roleName',
                'roles.code as roleCode',
            ])
            .orderBy('users.createdAt', 'desc')
            .limit(query.limit)
            .offset(query.offset)
            .execute();

        return {
            total: Number(total?.count || 0),
            data,
        };
    }
}