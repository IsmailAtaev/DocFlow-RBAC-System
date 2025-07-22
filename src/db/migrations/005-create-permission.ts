import { Kysely, sql } from 'kysely';

const tableName = 'permissions';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable(tableName)
        .ifNotExists()
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('model', 'varchar(255)', (col) => col.notNull())
        .addColumn('action', 'varchar(255)', (col) => col.notNull())
        .addUniqueConstraint('unique_model_action', ['model', 'action'])
        .addColumn('createdAt', 'timestamptz', (c) => c.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable(tableName).ifExists().execute();
}