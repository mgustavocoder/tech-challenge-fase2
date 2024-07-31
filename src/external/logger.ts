import Pino from 'pino'

export class Logger {
  private readonly logger: any

  constructor () {
    this.logger = Pino({
      level: 'info',
      timestamp: false
    })
  }

  info (message: string): void {
    this.logger.info(message)
  }

  error (message: string): void {
    this.logger.error(message)
  }
}
