import { ThemeProvider } from '@/components/ThemeProvider'
import Toaster from '@/components/ui/sooner'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto'
})

export const metadata: Metadata = {
  title: '성균관대학교 미식축구부 로얄스',
  description: '성균관대학교 미식축구부 로얄스 홈페이지입니다',
  metadataBase: new URL('https://skku-royals.com')
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('font-sans antialiased', noto.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="dark:bg-custom-black bg-white">{children}</div>
          <Toaster
            richColors
            position="top-center"
            closeButton={true}
            duration={2000}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
