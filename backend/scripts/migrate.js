import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import pkg from 'pg'

const { Pool } = pkg

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendRoot = path.join(__dirname, '..')
dotenv.config({ path: path.join(backendRoot, '.env') })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL missing. Set it in backend/.env')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
})

const sqlDir = path.join(backendRoot, 'sql')
const files = (await fs.readdir(sqlDir))
  .filter((f) => f.endsWith('.sql'))
  .sort()

try {
  for (const file of files) {
    const sql = await fs.readFile(path.join(sqlDir, file), 'utf8')
    await pool.query(sql)
    console.log('Migration OK:', file)
  }
} catch (err) {
  console.error(err)
  process.exit(1)
} finally {
  await pool.end()
}
