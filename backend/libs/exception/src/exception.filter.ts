import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  Logger,
  HttpException
} from '@nestjs/common'
import type { CustomHttpException } from './custom-http-exception'

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('EXCEPTION')

  catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = exception.getStatus()

    if (status >= 500) {
      this.loggingError(exception, request)
      exception.message = '알 수 없는 오류 발생'
    } else {
      if (process.env.NODE_ENV !== 'production') {
        this.loggingError(exception, request)
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (exception.getResponse() as any).message ?? exception.message
    })
  }

  private loggingError(exception: CustomHttpException, request) {
    const logData = {
      errorType: exception.name,
      message: exception.message,
      path: `${request.method} ${request.url}`,
      stack: exception.originStack,
      requestBody: request.body,
      user: request.user
        ? {
            id: request.user.id,
            username: request.user.username,
            role: request.user.role
          }
        : undefined
    }

    if (process.env.NODE_ENV === 'production') {
      this.logger.error(JSON.stringify(logData))
    } else {
      if (exception.originStack) {
        this.logger.error(exception.originStack)
      }
      this.logger.error(logData)
    }
  }
}
