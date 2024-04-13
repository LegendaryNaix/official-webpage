import { Button } from '@/components/ui/button'
import fetcher from '@/lib/fetcher'
import type { QuizRank } from '@/lib/types/quiz'
import Link from 'next/link'
import RankingTable from './_components/RankingTable'

export default async function QuizRankPage() {
  const rank = await fetcher.get<QuizRank>('/quiz')

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center p-6 lg:px-8">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-y-10">
        <h1 className="text-2xl font-bold text-amber-400">골든벨 랭킹</h1>
        <div className="flex w-full flex-col space-y-5">
          <h2>재학생</h2>
          <RankingTable scores={rank.senior} />
        </div>
        <div className="flex w-full flex-col space-y-5">
          <h2>신입생</h2>
          <RankingTable scores={rank.newbie} />
        </div>
        <Link href="/quiz" className="w-full">
          <Button className="w-full">뒤로가기</Button>
        </Link>
      </div>
    </main>
  )
}
