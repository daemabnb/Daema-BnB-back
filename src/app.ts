import * as mongoose from 'mongoose'
import * as express from 'express'
import { config } from 'dotenv'
import logger from './util/logger'
import router from './routes/index'
import passport from './util/passport'
import Err from './util/error'

config()

const mongoUri = process.env.MONGO_URI as string
const mongooseOptions: mongoose.ConnectionOptions = {
  useNewUrlParser: true
}

mongoose.connect(mongoUri, mongooseOptions)
  .then(() => logger.info('connected mongoose'))
  .catch((e: Err) => logger.error(e.stack as string))

const app: express.Application = express()

app.use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(passport.initialize())
  .use(router)
  .use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(new Err(`Not found - ${req.originalUrl}`, 404))
  })
  .use((err: Err, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack as string)
    res.status(err.status || 500).end()
  })

export default app