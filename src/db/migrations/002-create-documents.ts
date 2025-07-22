import { Kysely, sql } from 'kysely'

const tableName = 'documents'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('documentTypeId', 'uuid', (col) => col.notNull())
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('path', 'varchar(1024)', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (c) => c.notNull().defaultTo(sql`now()`))
    .addForeignKeyConstraint('fk_document_type', ['documentTypeId'], 'document_types', ['id'])
    .addForeignKeyConstraint('fk_document_user', ['userId'], 'users', ['id'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(tableName).ifExists().execute()
}