import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { DB } from './types' 
import * as dotenv from 'dotenv'
dotenv.config();

@Injectable()
export class KyselyService implements OnModuleDestroy {
  readonly db: Kysely<DB>
  private readonly pool = new Pool({ connectionString: process.env.DATABASE_URL })

  constructor() {
    this.db = new Kysely<DB>({
      dialect: new PostgresDialect({ pool: this.pool }),
    })
  }

  async onModuleDestroy() {
    await this.db.destroy()
  }
}