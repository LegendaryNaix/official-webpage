import { ScheduleType } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateScheduleDTO {
  @IsNumber()
  @IsNotEmpty()
  surveyGroupId: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startedAt: Date

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endedAt: Date

  @IsEnum(ScheduleType)
  @IsNotEmpty()
  type: ScheduleType

  @IsString()
  @IsNotEmpty()
  description: string
}

export class UpdateScheduleDTO {
  @IsNumber()
  @IsOptional()
  surveyGroupId?: number

  @IsString()
  @IsOptional()
  name?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startedAt?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endedAt?: Date

  @IsEnum(ScheduleType)
  @IsOptional()
  type?: ScheduleType

  @IsString()
  @IsOptional()
  description?: string
}
