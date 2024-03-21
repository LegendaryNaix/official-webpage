import { AccountStatus, Role } from '@prisma/client'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator'

export class UpdateUserProfileDTO {
  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class UpdateUserDTO {
  @IsEnum(Role)
  @IsOptional()
  role?: Role

  @IsEnum(AccountStatus)
  @IsOptional()
  status?: AccountStatus
}
