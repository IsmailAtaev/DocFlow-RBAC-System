import { KyselyService } from '../db/kysely.service'
import { Insertable, sql } from 'kysely'
import { Injectable } from '@nestjs/common'
import { ConstantsDb } from '../db/constants-db'
import { jsonArrayFrom, jsonBuildObject } from 'kysely/helpers/postgres';
import { getDateRange } from 'src/shared/utils/date-range'
import { DB } from 'src/db/types'
import { LimitOffset, UUID } from 'src/shared/validation/schemas'
import { RoleDto, RoleQueryDto } from './dto/role.dto';

const tableName = ConstantsDb.ROLES;
const tablePermissons = ConstantsDb.PERMISSIONS;
const tableRolePermissons = ConstantsDb.ROLE_PERMISSIONS;

@Injectable()
export class RoleRepo {
    constructor(private kysely: KyselyService) { }

    async create(newRole: Insertable<DB['roles']>) {
        return await this.kysely.db
            .insertInto(tableName)
            .values({ code: newRole.code, name: newRole.name, })
            .returningAll()
            .executeTakeFirst();
    }

    async update(id: UUID, dto: RoleDto) {
        return await this.kysely.db
            .updateTable(tableName)
            .set({ code: dto.code, name: dto.name })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    }

    async remove(id: UUID) {
        return await this.kysely.db
            .deleteFrom(tableName)
            .where('id', '=', id)
            .returningAll()
            .execute();
    }

    async findOne(id: string) {
        return await this.kysely.db
            .selectFrom(tableName)
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
    }

    async findRoleById(id: UUID) {
        return await this.kysely.db
            .selectFrom(tableName)
            .select(['id'])
            .where('id', '=', id)
            .executeTakeFirst();
    }

    async findRoleByCode(code: string) {
        return await this.kysely.db
            .selectFrom(tableName)
            .select('id')
            .where('code', '=', code)
            .executeTakeFirst();
    }

    async findAll(query: RoleQueryDto & LimitOffset) {
        const { fromDate, toDate } = getDateRange(query.createdFrom, query.createdTo);

        let q = this.kysely.db.selectFrom(tableName);

        if (query.code) q = q.where('roles.code', '=', query.code);
        if (query.name) q = q.where('roles.name', '=', query.name);
        if (fromDate) q = q.where('roles.createdAt', '>=', fromDate);
        if (toDate) q = q.where('roles.createdAt', '<=', toDate);

        const total = await q.select((eb) => eb.fn.countAll().as('count')).executeTakeFirst();

        const data = await q
            .select(['id', 'code', 'name', 'createdAt'])
            .orderBy('createdAt', 'desc')
            .limit(query.limit)
            .offset(query.offset)
            .execute();

        return {
            total: Number(total?.count || 0),
            data,
        };
    }

    async findAllWithPermissions() {
        return await this.kysely.db
            .selectFrom('roles')
            .leftJoin('role_permissions', 'roles.id', 'role_permissions.role_id')
            .leftJoin('permissions', 'permissions.id', 'role_permissions.permission_id')
            .select((eb) => [
                'roles.id',
                'roles.code',
                'roles.name',
                'roles.createdAt',
                jsonArrayFrom(
                    eb.selectFrom('role_permissions')
                        .innerJoin('permissions', 'permissions.id', 'role_permissions.permission_id')
                        .select([
                            jsonBuildObject({
                                id: sql.ref('permissions.id'),
                                model: sql.ref('permissions.model'),
                                action: sql.ref('permissions.action'),
                            }).as('permission')
                        ]).whereRef('role_permissions.role_id', '=', 'roles.id')
                ).as('permissions'),
            ])
            .groupBy('roles.id')
            .orderBy('roles.code', 'asc')
            .execute();
    }

    // role_permissions
    async findPermissionsByIds(ids: string[]) {
        return await this.kysely.db
            .selectFrom(tablePermissons)
            .select(['id'])
            .where('id', 'in', ids)
            .execute();
    }

    async getRolePermissions(roleId: UUID) {
        return this.kysely.db
            .selectFrom(tableRolePermissons)
            .innerJoin('permissions', 'permissions.id', 'role_permissions.permission_id')
            .select(['permissions.id', 'permissions.model', 'permissions.action'])
            .where('role_permissions.role_id', '=', roleId)
            .execute();
    }

    async clearPermissions(roleId: UUID) {
        await this.kysely.db
            .deleteFrom(tableRolePermissons)
            .where('role_id', '=', roleId)
            .execute();
    }

    async addPermissions(insertData: { role_id: UUID; permission_id: string }[]) {
        return await this.kysely.db
            .insertInto(tableRolePermissons)
            .values(insertData)
            .execute();
    }
}