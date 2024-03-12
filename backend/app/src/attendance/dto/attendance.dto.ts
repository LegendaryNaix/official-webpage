import {
  AttendanceLocation,
  AttendanceResponse,
  type Attendance,
  type RosterType
} from '@prisma/client'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateAttendanceDTO {
  @IsNumber()
  @IsNotEmpty()
  scheduleId: number

  @IsEnum(AttendanceResponse)
  @IsNotEmpty()
  response: AttendanceResponse

  @IsString()
  @IsOptional()
  reason?: string

  @IsEnum(AttendanceLocation)
  @IsOptional()
  location?: AttendanceLocation
}

export class UpdateAttendanceDTO {
  @IsEnum(AttendanceResponse)
  @IsOptional()
  response: AttendanceResponse

  @IsString()
  @IsOptional()
  reason?: string

  @IsEnum(AttendanceLocation)
  @IsOptional()
  location?: AttendanceLocation

  @IsEnum(AttendanceResponse)
  @IsOptional()
  result: AttendanceResponse
}

export interface AttendanceWithRoster extends Attendance {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Roster: {
    id: number
    name: string
    type: RosterType
    registerYear: number
    offPosition?: string
    defPosition?: string
    splPosition?: string
  }
}
