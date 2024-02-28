import Container from './Container'

export default function Section({
  children,
  title,
  more
}: {
  children: React.ReactNode
  title: string
  more?: React.ReactNode
}) {
  return (
    <section className="flex h-full w-full flex-col space-y-3">
      <div className="flex items-center justify-between px-4 sm:px-0">
        <h1 className="text-lg font-bold text-zinc-700 lg:text-xl dark:text-zinc-300">
          {title}
        </h1>
        {more}
      </div>
      <Container>{children}</Container>
    </section>
  )
}
