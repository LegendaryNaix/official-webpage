import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AttendanceStatisticPage() {
  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full flex-col justify-between space-y-5 px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">출석통계</h1>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-3">
            <Card>
              <CardHeader className="font-bold">
                <div className="flex items-center">
                  <UserIcon className="mr-1.5 h-5 w-5" />
                  <h2>개인별 출석 통계</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-5 text-xs sm:text-sm">
                  <p>개인별로 출석을 확인</p>
                  <Link href="#">
                    <Button variant="accent">이동하기</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 md:col-span-3">
            <Card>
              <CardHeader className="font-bold">
                <div className="flex items-center">
                  <UserIcon className="mr-1.5 h-5 w-5" />
                  <h2>전체 출석 통계</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-5 text-xs sm:text-sm">
                  <p>최대 한달 이내 기간 동안의 전체 부원의 출석 확인</p>
                  <Link href="/console/statistic/all">
                    <Button variant="accent">이동하기</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
