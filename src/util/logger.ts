import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Request } from 'express'

const INFO_LOG_FILE = './log/system.log'
const ERROR_LOG_FILE = './log/error/error.log'
const DATE_PATTERN = 'YYYY_MM-DD-HH'

const logFormmat = winston.format.printf(
  info => `[${new Date().toString()}] ${info.level}: ${info.message}`
)

const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      level: 'info',
      filename: INFO_LOG_FILE,
      datePattern: DATE_PATTERN,
      zippedArchive: true,
      format: logFormmat
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
