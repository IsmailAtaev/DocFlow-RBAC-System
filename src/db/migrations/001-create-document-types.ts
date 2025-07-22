import { Kysely, sql } from 'kysely'

const tableName = 'document_types'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable(tableName)
        .ifNotExists()
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('type', 'varchar(255)', (col) => col.notNull().unique())
        .addColumn('createdAt', 'timestamptz', (c) => c.notNull().defaultTo(sql`now()`))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable(tableName).ifExists().execute()
}