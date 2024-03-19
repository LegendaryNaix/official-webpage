import ConsoleSidebar from '@/components/ConsoleSidebar'

export default function ConsoleLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ConsoleSidebar />
      <div className="mt-16 flex flex-grow flex-col pb-24 lg:mt-0 lg:pl-72">
        {children}
      </div>
    </div>
  )
}
