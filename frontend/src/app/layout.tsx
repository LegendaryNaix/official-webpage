import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Toaster from '@/components/ui/sooner'
import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const gothicA1 = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
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
      <body className={`${gothicA1.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="h-[80px]"></div>
          {children}
          <Footer />
        </div>
        <Toaster
          richColors
          position="top-center"
          closeButton={true}
          duration={2000}
        />
      </body>
    </html>
  )
}
