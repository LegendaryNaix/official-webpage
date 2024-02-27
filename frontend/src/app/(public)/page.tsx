import Image from 'next/image'

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center p-6 lg:grid lg:grid-cols-12 lg:px-8">
      <div className="col-span-12 hidden items-end lg:col-span-5 lg:-mr-10 lg:flex lg:flex-col">
        <h1 className="text-4xl font-bold text-zinc-900 lg:text-5xl dark:text-gray-50">
          SKKU ROYALS
        </h1>
        <h1 className="-mt-1.5 text-sm font-normal text-amber-500 lg:text-lg">
          American Football Team
        </h1>
      </div>
      <div className="col-span-12 -mb-12 flex flex-col flex-nowrap items-center lg:col-span-7 lg:mb-0">
        <Image
          width={1080}
          height={1080}
          priority={true}
          src="/hero.png"
          alt="hero image"
          className="h-80 w-auto lg:h-[640px]"
        />
      </div>
      <div className="col-span-12 flex flex-col items-end lg:hidden">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-gray-50">
          SKKU ROYALS
        </h1>
        <h1 className="-mt-1.5 text-sm font-light text-amber-400 lg:text-lg dark:text-amber-400">
          American Football Team
        </h1>
      </div>
    </main>
  )
}
