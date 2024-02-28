import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const sessionCookieName = process.env.NEXTAUTH_URL?.startsWith('https://')
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token'

export default withAuth(
  (req) => {
    if (req.nextauth.token?.error) {
      const res = NextResponse.redirect(new URL('/login', req.url))
      res.cookies.delete(sessionCookieName)
      return res
    }
  },
  {
    pages: {
      signIn: '/login'
    },
    callbacks: {
      authorized: ({ token }) => (token?.accessToken ? true : false)
    }
  }
)

export const config = { matcher: ['/console/:path*'] }
