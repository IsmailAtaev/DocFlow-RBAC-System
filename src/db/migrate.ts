import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import { up as upCreateDocumentTypes } from './migrations/001-create-document-types';
import { up as upCreateDocuments } from './migrations/002-create-documents';
import { up as upCreateRole } from './migrations/003-create-role';
import { up as upCreateUser } from './migrations/004-create-user';
import { up as upCreatePermission } from './migrations/005-create-permission';
import { up as upCreateRolePermission } from './migrations/006-create-role_permission';

dotenv.config()

async function migrate() {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  })

  try {
    await upCreateRole(db)
    await upCreatePermission(db)
    await upCreateDocumentTypes(db)
    await upCreateUser(db)
    await upCreateDocuments(db)
    await upCreateRolePermission(db)

    console.log('Migration completed successfully.')
  } catch (e) {
    console.error('Migration failed:', e)
  } finally {
    await db.destroy()
  }
}

migrate()