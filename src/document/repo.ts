import { KyselyService } from '../db/kysely.service'
import { Insertable } from 'kysely'
import { DB } from '../db/types'
import { Injectable } from '@nestjs/common'
import { ConstantsDb } from '../db/constants-db'
import { getDateRange } from 'src/shared/utils/date-range'
import { DocumentDto, DocumentQueryDto } from './dto/document.dto'
import { LimitOffset } from 'src/shared/validation/schemas'

const tableName = ConstantsDb.DOCUMENTS;

@Injectable()
export class DocumentRepo {
    constructor(private kysely: KyselyService) { }

    async createOne(document: Insertable<DB['documents']>) {
        return await this.kysely.db
            .insertInto(tableName)
            .values(document)
            .returningAll()
            .executeTakeFirst();
    }

    async update(id: string, dto: DocumentDto) {
        return await this.kysely.db.
            updateTable(tableName)
            .set(dto)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    }

    async findOne(id: string) {
        return await this.kysely.db
            .selectFrom(tableName)
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
    }

    async delete(id: string) {
        return await this.kysely.db
            .deleteFrom(tableName)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    }

    async findDocumentsByUserId(userId: string) {
        return await this.kysely.db
            .selectFrom(tableName)
            .innerJoin('document_types', 'documents.documentTypeId', 'document_types.id')
            .select([
                'documents.id',
                'documents.name',
                'documents.path',
                'documents.createdAt',
                'document_types.id as typeId',
                'document_types.type as typeName',
            ])
            .where('documents.userId', '=', userId)
            .execute();
    }

    async findAll(query: DocumentQueryDto & LimitOffset) {
        const { fromDate, toDate } = getDateRange(query.createdFrom, query.createdTo);

        let q = this.kysely.db
            .selectFrom(tableName)
            .innerJoin('document_types', 'documents.documentTypeId', 'document_types.id')
            .innerJoin('users', 'documents.userId', 'users.id');

        if (query.name) q = q.where('documents.name', '=', query.name);
        if (query.documentType) q = q.where('document_types.type', '=', query.documentType);
        if (fromDate) q = q.where('documents.createdAt', '>=', fromDate);
        if (toDate) q = q.where('documents.createdAt', '<=', toDate);

        const total = await q.select((eb) => eb.fn.countAll().as('count')).executeTakeFirst();

        const data = await q
            .select([
                'documents.id',
                'documents.name',
                'documents.path',
                'documents.createdAt',
                'document_types.type as documentType',
                'users.username as username',
            ])
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