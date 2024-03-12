import { CreateAttendanceDTO } from '@/attendance/dto/attendance.dto'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

export class CreateSurveyGroupDTO {
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

  @IsBoolean()
  @IsNotEmpty()
  required: boolean
}

export class UpdateSurveyGroupDTO {
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

  @IsBoolean()
  @IsOptional()
  required?: boolean
}

export class SubmitSurveyDTO {
  @IsString()
  @IsNotEmpty()
  studentId: string

  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceDTO)
  attendances: CreateAttendanceDTO[]
}
