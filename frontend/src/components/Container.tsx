export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-full w-full overflow-y-auto bg-zinc-100 px-4 py-4 sm:rounded-md sm:px-6 dark:bg-zinc-800/70">
      {children}
    </div>
  )
}
