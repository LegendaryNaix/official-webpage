import { Injectable, type Scope } from '@nestjs/common'

/**
 * Service Class에 사용
 */
export const Service = (options?: { scope?: Scope }): ClassDecorator => {
  return Injectable(options)
}

/**
 * Guard Class에 사용
 */
export const Guard = (options?: { scope?: Scope }): ClassDecorator => {
  return Injectable(options)
}

/**
 * 기타 의존성 Class에 사용
 */
export const Dependency = (options?: { scope?: Scope }): ClassDecorator => {
  return Injectable(options)
}
