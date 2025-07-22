import { Kysely, sql } from 'kysely';

const tableName = 'users';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable(tableName)
        .ifNotExists()
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('username', 'varchar(255)', (col) => col.notNull().unique())
        .addColumn('password', 'varchar(255)', (col) => col.notNull().unique())
        .addColumn('fullname', 'varchar(255)', (col) => col.notNull())
        .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
        .addColumn('role_id', 'uuid', (col) => col.references('roles.id').onDelete('restrict').notNull())
        .addColumn('createdAt', 'timestamptz', (c) => c.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable(tableName).ifExists().execute();
}