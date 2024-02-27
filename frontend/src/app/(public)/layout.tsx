import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="dark:bg-custom-black flex min-h-screen flex-col bg-white">
      <Header />
      <div className="h-[65px]"></div>
      {children}
      <Footer />
    </div>
  )
}
