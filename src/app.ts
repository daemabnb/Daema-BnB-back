import * as mongoose from 'mongoose'
import * as express from 'express'
import * as cors from 'cors'
import * as helmet from 'helmet'
import { mongoUri } from './config'
import { SaleDocument } from './types/Sale'
import { ShareDocument } from './types/Share'
import logger, { reqLogger } from './util/logger'
import slack from './util/slack'
import router from './routes/index'
import Err from './util/error'

const mongooseOptions: mongoose.ConnectionOptions = {
  useNewUrlParser: true
}

mongoose.connect(mongoUri, mongooseOptions)
  .then(() => logger.info('connected mongoose'))
  .catch((e: Err) => logger.error(e.stack as string))

declare module 'express' {
  interface Request {
    sale: SaleDocument
    share: ShareDocument
  }
}

const app: express.Application = express()

app.use(cors())
  .use(helmet())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    reqLogger(req)
    next()
  })
  .use(router)
  .use((req: express.Request, res: express.Response) => res.status(404).end())
  .use((err: Err, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack as string)
    slack(err.stack as string)

    res.status(err.status || 500).end()
  })

export default app
