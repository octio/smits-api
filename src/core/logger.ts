import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'
import { createLogger, format, transports } from 'winston'

type NewInfo = {
  timestamp?: string
  level: string
  message: string
}

const { colorize, combine, printf } = format

const rootPath = path.join(`${__dirname}../../../logs`)
const infoPath = path.join(rootPath, 'info.log')
const errorPath = path.join(rootPath, 'error.log')
const combinedPath = path.join(rootPath, 'combined.log')

const myFormat = printf(
  (info): string => `${info.timestamp} [${info.level}]: ${info.message}`
)

const createLogDirectory = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath)
  }
}

const appendTimestamp = format(
  (info): NewInfo => {
    const timestamp = DateTime.fromJSDate(new Date()).toFormat(
      "yyyy-MM-dd'T'HH:mm:ssZZ"
    )

    const newInfo = { ...info, timestamp }

    return newInfo
  }
)

const formatConfig = combine(appendTimestamp(), colorize(), myFormat)

const logger = createLogger({
  level: 'info',
  format: formatConfig,
  transports: [
    new transports.File({ filename: combinedPath }),
    new transports.File({ filename: errorPath, level: 'error' }),
    new transports.File({ filename: infoPath, level: 'info' })
  ]
})

const addConsoleOnDevelopment = function addConsoleOnDevelopment(): void {
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        format: formatConfig
      })
    )
  }
}

addConsoleOnDevelopment()
createLogDirectory(rootPath)

export default logger
