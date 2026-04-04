import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import { errorHandler } from './middleware/error.middleware.js'

const app = express()

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api', routes)

app.use(errorHandler)

export default app
