'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: Props) {
  const router = useRouter()

  return (
    <div className="flex h-screen w-full flex-1 flex-col items-center justify-center gap-3 py-12">
      <Image
        src="/logo.png"
        width={256}
        height={256}
        className="h-auto w-40 sm:w-60"
        alt="ROYALS"
      />
      <p className="mt-8 text-2xl font-extrabold text-red-500">
        예상치 못한 오류가 발생했습니다
      </p>
      <p className="mb-4 max-w-[36rem] text-lg font-semibold">
        {error.message || 'Unknown Error'}
      </p>
      <Button variant="outline" onClick={() => router.push('/')}>
        홈으로 이동
      </Button>
    </div>
  )
}
