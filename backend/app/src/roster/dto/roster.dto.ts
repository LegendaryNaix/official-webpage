import { RosterStatus, RosterType } from '@prisma/client'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator'

export class CreateRosterDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(RosterStatus)
  @IsNotEmpty()
  status: RosterStatus

  @IsEnum(RosterType)
  @IsNotEmpty()
  type: RosterType

  @IsString()
  @IsOptional()
  offPosition?: string

  @IsString()
  @IsOptional()
  defPosition?: string

  @IsString()
  @IsOptional()
  splPosition?: string

  @Min(0)
  @Max(99)
  @IsNumber()
  @IsOptional()
  backNumber?: number

  @IsNumber()
  @IsNotEmpty()
  registerYear: number

  @IsNumber()
  @IsNotEmpty()
  admissionYear: number

  @IsString()
  @IsNotEmpty()
  class: string

  @IsString()
  @IsNotEmpty()
  studentId: string
}

export class UpdateRosterDTO {
  @IsString()
  @IsOptional()
  name?: string

  @IsEnum(RosterStatus)
  @IsOptional()
  status?: RosterStatus

  @IsEnum(RosterType)
  @IsOptional()
  type?: RosterType

  @IsString()
  @IsOptional()
  offPosition?: string

  @IsString()
  @IsOptional()
  defPosition?: string

  @IsString()
  @IsOptional()
  splPosition?: string

  @Min(0)
  @Max(99)
  @IsNumber()
  @IsOptional()
  backNumber?: number

  @IsNumber()
  @IsOptional()
  registerYear?: number

  @IsNumber()
  @IsOptional()
  admissionYear?: number

  @IsString()
  @IsOptional()
  class?: string

  @IsString()
  @IsOptional()
  studentId?: string
}
