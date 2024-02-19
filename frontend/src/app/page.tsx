import Image from 'next/image'

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col-reverse items-center justify-center p-6 lg:grid lg:grid-cols-12 lg:px-8">
      <div className="col-span-12 flex flex-col items-end lg:col-span-5 lg:-mr-6">
        <h1 className="text-4xl font-bold text-gray-50 lg:text-5xl">
          SKKU ROYALS
        </h1>
        <h1 className="-mt-1.5 text-sm font-light text-gray-400 lg:text-lg">
          American Football Team
        </h1>
      </div>
      <div className="col-span-12 -mb-14 flex flex-col flex-nowrap items-center lg:col-span-7 lg:mb-0">
        <Image
          width={1080}
          height={1080}
          src="/hero.png"
          alt="hero image"
          className="h-80 w-auto lg:h-[640px]"
        />
      </div>
    </main>
  )
}
