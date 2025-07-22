import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { seedRolesAndPermissions, seedRolePermissions, createAdminUser } from './rbac.seed';

config();

const db = new Kysely<any>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});

async function main() {
    try {
        await seedRolesAndPermissions(db);
        await seedRolePermissions(db);
        await createAdminUser(db);
    } catch (error) {
        console.error('Error during sidecarring:', error);
    } finally {
        await db.destroy();
    }
}

main();