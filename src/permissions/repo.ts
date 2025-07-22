import { KyselyService } from '../db/kysely.service'
import { Insertable } from 'kysely'
import { Injectable } from '@nestjs/common'
import { ConstantsDb } from '../db/constants-db'
import { DB } from 'src/db/types';
import { getDateRange } from 'src/shared/utils/date-range';
import { PermissionDto, PermissionQueryDto } from './dto/permission.dto';
import { LimitOffset } from 'src/shared/validation/schemas';

const tableName = ConstantsDb.PERMISSIONS;

@Injectable()
export class PermissionRepo {
    constructor(private kysely: KyselyService) { }

    async create(newPermission: Insertable<DB['permissions']>) {
        return await this.kysely.db
            .insertInto(tableName)
            .values({
                model: newPermission.model,
                action: newPermission.action
            })
            .returningAll()
            .executeTakeFirst();
    }

    async update(id: string, dto: PermissionDto) {
        return this.kysely.db
            .updateTable(tableName)
            .set({ ...dto })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    }

    async remove(id: string) {
        return await this.kysely.db
            .deleteFrom(tableName)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    }

    async findOne(id: string) {
        return this.kysely.db
            .selectFrom(tableName)
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
    }

    async findAll(query: PermissionQueryDto & LimitOffset) {
        const { fromDate, toDate } = getDateRange(query.createdFrom, query.createdTo);

        let q = this.kysely.db.selectFrom(tableName);

        if (query.model) q = q.where('permissions.model', '=', query.model);
        if (query.action) q = q.where('permissions.action', '=', query.action);
        if (fromDate) q = q.where('permissions.createdAt', '>=', fromDate);
        if (toDate) q = q.where('permissions.createdAt', '<=', toDate);

        const total = await q.select((eb) => eb.fn.countAll().as('count')).executeTakeFirst();

        const data = await q
            .select(['id', 'model', 'action', 'createdAt'])
            .orderBy('createdAt', 'desc')
            .limit(query.limit)
            .offset(query.offset)
            .execute();

        return {
            total: Number(total?.count || 0),
            data,
        };
    }
}