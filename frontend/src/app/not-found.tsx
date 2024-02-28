import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-1 flex-col items-center justify-center gap-3 py-12">
      <Image
        src="/logo.png"
        width={256}
        height={256}
        className="h-auto w-40 sm:w-60"
        alt="ROYALS"
      />
      <h1 className="mt-8 text-2xl font-extrabold text-amber-400">Not Found</h1>
      <p className="mb-4 max-w-[36rem] text-lg font-semibold">
        요청하신 페이지가 존재하지 않습니다
      </p>
      <Link href="/">
        <Button>홈으로 이동</Button>
      </Link>
    </div>
  )
}
