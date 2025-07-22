import { KyselyService } from '../db/kysely.service'
import { Insertable } from 'kysely'
import { DB } from '../db/types'
import { Injectable } from '@nestjs/common'
import { ConstantsDb } from '../db/constants-db'
import { DocumentTypeQuery } from './dto/document-type.query.dto'
import { getDateRange } from 'src/shared/utils/date-range'
import { LimitOffset, UUID } from 'src/shared/validation/schemas'

const tableName = ConstantsDb.DOCUMENT_TYPES;

@Injectable()
export class DocumentTypeRepo {
    constructor(private kysely: KyselyService) { }

    async create(documentType: Insertable<DB['document_types']>) {
        return await this.kysely.db
            .insertInto(tableName)
            .values(documentType)
            .returningAll()
            .executeTakeFirst()
    }

    async update(id: UUID, documentType: Partial<Insertable<DB['document_types']>>) {
        return await this.kysely.db
            .updateTable(tableName)
            .set(documentType)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    }

    async delete(id: UUID) {
        return await this.kysely.db
            .deleteFrom(tableName)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    }

    async findOne(id: UUID) {
        return await this.kysely.db
            .selectFrom(tableName)
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst()
    }

    async findAll(query: DocumentTypeQuery & LimitOffset) {
        const { fromDate, toDate } = getDateRange(query.createdFrom, query.createdTo);

        let q = this.kysely.db.selectFrom(tableName);

        if (query.type) q = q.where('document_types.type', '=', query.type);
        if (fromDate) q = q.where('document_types.createdAt', '>=', fromDate);
        if (toDate) q = q.where('document_types.createdAt', '<=', toDate);

        const total = await q.select((eb) => eb.fn.countAll().as('count')).executeTakeFirst();

        const data = await q
            .select(['id', 'type', 'createdAt'])
            .orderBy('createdAt', 'desc')
            .limit(query.limit)
            .offset(query.offset)
            .execute();

        return {
            total: Number(total?.count || 0),
            data,
        }
    }
}