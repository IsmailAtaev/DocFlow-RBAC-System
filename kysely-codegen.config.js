// kysely-codegen.config.js
module.exports = {
  connectionString: process.env.DATABASE_URL,
  outFile: 'src/db/types.ts',
  dialect: 'postgres',
}