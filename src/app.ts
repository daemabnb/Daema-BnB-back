import * as express from 'express'
import router from './routes/index'
const app: express.Application = express()

app.use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(router)

export default app
