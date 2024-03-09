export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-full w-full bg-zinc-100/50 px-4 py-4 sm:rounded-md sm:px-6 md:overflow-y-auto dark:bg-zinc-800/70">
      {children}
    </div>
  )
}
