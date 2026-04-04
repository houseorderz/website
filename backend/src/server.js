import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '..', '.env')
dotenv.config({ path: envPath })

if (!process.env.DATABASE_URL) {
  console.error(
    `Missing DATABASE_URL. Add it to ${envPath} (copy from backend/.env.example).`,
  )
  process.exit(1)
}

const jwtSecret = process.env.JWT_SECRET || ''
if (jwtSecret.length < 16) {
  console.error(
    `JWT_SECRET must be set in ${envPath} (at least 16 characters). See backend/.env.example.`,
  )
  process.exit(1)
}

const { default: app } = await import('./app.js')

const port = Number(process.env.PORT) || 5050

const server = app.listen(port, () => {
  console.log(`API http://localhost:${port}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Stop the other process or set PORT in backend/.env to a free port.`,
    )
  } else {
    console.error(err)
  }
  process.exit(1)
})
