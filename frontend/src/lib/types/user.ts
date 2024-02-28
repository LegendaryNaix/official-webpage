import type { AccountStatus, Role } from '../enums'

type UserBasic = {
  id: number
  username: string
  email: string
  role: Role
}

export interface User extends UserBasic {
  nickname: string
  lastLogin: string
  lastPasswordChanged: string
  profilImgUrl?: string
  status: AccountStatus
}

export interface UserProfile extends UserBasic {
  nickname: string
  lastLogin: string
  profileImgUrl?: string
  status: AccountStatus
}
