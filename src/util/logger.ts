import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'

const INFO_LOG_FILE = './log/system.log'
const ERROR_LOG_FILE = './log/error/error.log'
const DATE_PATTERN = 'YYYY_MM-DD-HH'

const logFormmat = winston.format.printf(
  info => `[${new Date().toString()}] ${info.level}: ${info.message}`
)

export default winston.createLogger({
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
