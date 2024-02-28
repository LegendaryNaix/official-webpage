import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserProfileDTO {
  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsEmail()
  @IsNotEmpty()
  email: string
}
