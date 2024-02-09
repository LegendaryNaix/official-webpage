import {
  EmptyParameterException,
  ParameterValidationException,
  UnidentifiedException,
  UnverifiedException,
  InvalidJwtTokenException,
  ForbiddenAccessException,
  EntityNotExistException,
  ConflictFoundException,
  DuplicateFoundException,
  UnprocessableDataException,
  UnprocessableFileDataException,
  CacheException,
  DatabaseException,
  UnexpectedException
} from './business.exception'
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  ConflictException
} from './custom-http-exception'

export const BusinessExceptionHandler = (error: Error) => {
  if (
    error instanceof EmptyParameterException ||
    error instanceof ParameterValidationException
  ) {
    throw new BadRequestException(error.message, error.stack)
  }

  if (
    error instanceof UnidentifiedException ||
    error instanceof InvalidJwtTokenException ||
    error instanceof UnverifiedException
  ) {
    throw new UnauthorizedException(error.message, error.stack)
  }

  if (error instanceof ForbiddenAccessException) {
    throw new ForbiddenException(error.message, error.stack)
  }

  if (error instanceof EntityNotExistException) {
    throw new NotFoundException(error.message, error.stack)
  }

  if (
    error instanceof ConflictFoundException ||
    error instanceof DuplicateFoundException
  ) {
    throw new ConflictException(error.message, error.stack)
  }

  if (
    error instanceof UnprocessableDataException ||
    error instanceof UnprocessableFileDataException
  ) {
    throw new UnprocessableEntityException(error.message, error.stack)
  }

  if (
    error instanceof CacheException ||
    error instanceof DatabaseException ||
    error instanceof UnexpectedException
  ) {
    throw new InternalServerErrorException(error.message, error.stack)
  }

  throw new InternalServerErrorException(error.message, error.stack)
}
