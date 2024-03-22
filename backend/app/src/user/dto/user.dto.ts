import { AccountStatus, Role } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'
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

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  nickname: string
}

export class ReducedUser {
  @Expose()
  id: number

  @Expose()
  username: string

  @Expose()
  email: string

  @Expose()
  nickname: string

  @Expose()
  role: Role

  @Expose()
  status: AccountStatus

  @Expose()
  lastLogin: string

  @Expose()
  profileImageUrl?: string

  @Exclude()
  password: string
}

export interface ReducedUserDTO {
  id: number
  username: string
  email: string
  nickname: string
  role: Role
  status: AccountStatus
  lastLogin: string
  profileImageUrl?: string
}
