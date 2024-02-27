import ConsoleSidebar from '@/components/ConsoleSidebar'

export default function ConsoleLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ConsoleSidebar />
      <div className="flex-grow lg:pl-72">{children}</div>
    </div>
  )
}
