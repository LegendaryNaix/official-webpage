import { ACCESS_TOKEN_EXPIRE_TIME, API_BASE_URL } from '@/lib/vars'
import {
  getServerSession,
  type NextAuthOptions,
  type Session,
  type User
} from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getSession } from 'next-auth/react'
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

const getAuthToken = (res: Response) => {
  const Authorization = res.headers.get('authorization') as string
  const parsedCookie = parseCookie(res.headers.get('set-cookie') || '')
  const refreshToken = parsedCookie.get('refresh_token') as string
  const refreshTokenExpires = parsedCookie.get('Expires') as string
  return {
    accessToken: Authorization,
    refreshToken,
    accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRE_TIME - 30 * 1000,
    refreshTokenExpires: Date.parse(refreshTokenExpires) - 30 * 1000
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        const res = await fetch(API_BASE_URL + '/auth/login', {
          method: 'POST',
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json'
          },
          cache: 'no-store',
          body: JSON.stringify(credentials)
        })

        if (res.ok) {
          const {
            accessToken,
            refreshToken,
            refreshTokenExpires,
            accessTokenExpires
          } = getAuthToken(res)

          const userRes = await fetch(API_BASE_URL + '/user', {
            method: 'get',
            headers: {
              Authorization: accessToken
            }
          })

          if (userRes.ok) {
            const user: User = await userRes.json()
            return {
              username: user.username,
              role: user.role,
              accessToken,
              refreshToken,
              accessTokenExpires,
              refreshTokenExpires
            } as User
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60
  },
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.username = user.username
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires
        token.refreshTokenExpires = user.refreshTokenExpires
      } else if (token.accessTokenExpires <= Date.now()) {
        try {
          const reissueRes = await fetch(API_BASE_URL + '/auth/reissue', {
            headers: {
              cookie: `refresh_token=${token.refreshToken}`
            },
            cache: 'no-store'
          })

          if (!reissueRes.ok) {
            throw new Error('reissue failed')
          }

          return {
            ...token,
            ...getAuthToken(reissueRes)
          }
        } catch (error) {
          return {
            ...token,
            error: 'RefreshAccessTokenError'
          }
        }
      }

      return token
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      session.user = {
        username: token.username,
        role: token.role
      }
      session.token = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpires: token.accessTokenExpires,
        refreshTokenExpires: token.refreshTokenExpires
      }
      session.error = token.error
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}

/**
 * Get session data.
 * @description If call this function in client, then call getSession, else call getServerSession.
 */
export const auth = async (): Promise<Session | null> =>
  typeof window !== 'undefined'
    ? await getSession()
    : await getServerSession(authOptions)
