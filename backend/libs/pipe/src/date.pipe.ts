import {
  type ArgumentMetadata,
  type PipeTransform,
  BadRequestException
} from '@nestjs/common'
import { Dependency } from '@libs/decorator'

@Dependency()
export class ParseDatePipe implements PipeTransform<string, Date> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata): Date {
    const val = Date.parse(value)
    if (isNaN(val)) {
      throw new BadRequestException('유효하지 않은 날짜 형식입니다.')
    }
    return new Date(val)
  }
}
