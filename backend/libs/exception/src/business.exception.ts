export class BusinessException extends Error {
  name: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

/** [400] Throw when a user does not pass the essential parameter. */
export class EmptyParameterException extends BusinessException {}

/** [400] Throw when a user pass the invalid parameter. */
export class ParameterValidationException extends BusinessException {}

/** [401] Throw when a user cannot be identified with given credential. */
export class UnidentifiedException extends BusinessException {}

export class UnverifiedException extends BusinessException {}

/** [401] Throw when JWT token is invalid. */
export class InvalidJwtTokenException extends BusinessException {}

/** [403] Throw when request cannot be carried due to lack of permission. */
export class ForbiddenAccessException extends BusinessException {}

/** [404] Throw when requested entity is not found. */
export class EntityNotExistException extends BusinessException {}

/** [409] Throw when the request has a conflict with relevant entities.
 */
export class ConflictFoundException extends BusinessException {}

/** [409] Throw when the request has a conflict with relevant entities.
 */
export class DuplicateFoundException extends ConflictFoundException {}

/** [422] Throw when data is invalid or cannot be processed. */
export class UnprocessableDataException extends BusinessException {}

/** [422] Throw when file data is invalid or cannot be processed. */
export class UnprocessableFileDataException extends UnprocessableDataException {}

/** [500] Cache Exception */
export class CacheException extends BusinessException {}

/** [500] Database Exception */
export class DatabaseException extends BusinessException {}

/** [500] Unexpected Exception */
export class UnexpectedException extends BusinessException {}
