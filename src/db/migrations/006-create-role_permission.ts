import { Kysely, sql } from 'kysely';

const tableName = 'role_permissions';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable(tableName)
        .ifNotExists()
        .addColumn('role_id', 'uuid', (col) => col.notNull())
        .addColumn('permission_id', 'uuid', (col) => col.notNull())
        .addForeignKeyConstraint('fk_role_permissions_role', ['role_id'], 'roles', ['id'], (cb) => cb.onDelete('cascade'))
        .addForeignKeyConstraint('fk_role_permissions_permission', ['permission_id'], 'permissions', ['id'], (cb) => cb.onDelete('cascade'))
        .addPrimaryKeyConstraint('pk_role_permissions', ['role_id', 'permission_id'])
        .addColumn('createdAt', 'timestamptz', (c) => c.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable(tableName).ifExists().execute();
}