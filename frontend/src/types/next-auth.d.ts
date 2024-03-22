import type { AccountStatus } from '@/lib/enums'
import type { DefaultSession, DefaultUser } from 'next-auth'

interface UserData {
  username: string
  role: string
  status: AccountStatus
}

interface Token {
  accessToken: string
  refreshToken: string
  accessTokenExpires: number
  refreshTokenExpires: number
  error?: string
}

declare module 'next-auth' {
  interface User extends DefaultUser, UserData, Token {}
  interface Session extends DefaultSession {
    user: UserData
    token: Token
    error?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends UserData, Token {}
}
