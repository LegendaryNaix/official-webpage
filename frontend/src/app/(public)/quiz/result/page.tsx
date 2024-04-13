import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ResultPage({
  searchParams
}: {
  searchParams?: {
    score?: string
  }
}) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center p-6 lg:px-8">
      <div className="flex w-full max-w-[320px] flex-col items-center">
        <p className="text-lg">당신의 점수는?</p>
        <h1 className="mb-10 text-4xl font-bold text-amber-400">
          {searchParams?.score ?? 0}점
        </h1>
        <Link href="/quiz/rank">
          <Button>랭킹확인</Button>
        </Link>
      </div>
    </main>
  )
}
