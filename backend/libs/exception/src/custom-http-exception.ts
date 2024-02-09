import { HttpException, HttpStatus } from '@nestjs/common'

export class CustomHttpException extends HttpException {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected _originStack: string

  get originStack() {
    return this._originStack
  }

  set originStack(stack: string) {
    this._originStack = stack
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestException extends CustomHttpException {
  constructor(message: string, stack?: string) {
    super(message, HttpStatus.BAD_REQUEST)

    if (stack) {
      this.originStack = stack
    }
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedException extends CustomHttpException {
  constructor(message: string, stack?: string) {
    super(message, HttpStatus.UNAUTHORIZED)

    if (stack) {
      this.originStack = stack
    }
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenException extends CustomHttpException {
  constructor(message: string, stack?: string) {
    super(message, HttpStatus.FORBIDDEN)

    if (stack) {
      this.originStack = stack
    }
  }
}

/**
 * 404 Not found
 */
export class NotFoundException extends CustomHttpException {
  constructor(message: string, stack?: string) {
    super(message, HttpStatus.NOT_FOUND)

    if (stack) {
      this.originStack = stack
    }
  }
}

/**
 * 409 Conflict
 */
export class ConflictException extends CustomHttpException {
  constructor(message: string, stack?: string) {
    super(message, HttpStatus.CONFLICT)

    if (stack) {
      this.originStack = stack
    }
  }
}

/**
 * 422 Unprocessable Content
 */
export class UnprocessableEntityException extends CustomHttpException {
  constructor(message: string, stack?: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)

    if (stack) {
      this.originStack = stack
    }
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerErrorException extends CustomHttpException {
  constructor(message: string, stack?: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)

    if (stack) {
      this.originStack = stack
    }
  }
}
