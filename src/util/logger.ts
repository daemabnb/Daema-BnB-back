import * as winston from 'winston'
import { s3stream } from './aws'
import { Request } from 'express'

const ERROR_LOG_FILE = './log/error/error.log'

const logFormmat = winston.format.printf(
  info => `[${new Date().toString()}] ${info.level}: ${info.message}`
)

const logger = winston.createLogger({
  transports: [
    new (winston.transports.Stream)({
      level: 'info',
      stream: s3stream
    }),
    new (winston.transports.File)({
      level: 'error',
      filename: ERROR_LOG_FILE,
      format: logFormmat
    })
  ]
})

export const reqLogger = (req: Request): void => {
  const baseUrl = req.originalUrl
  const params = JSON.stringify(req.params)
  const query = JSON.stringify(req.query)
  const body = JSON.stringify(req.body)

  logger.info(`baseUrl: ${baseUrl}\nparams: ${params}\nquery: ${query}\nbody: ${body}`)
}

export default logger
