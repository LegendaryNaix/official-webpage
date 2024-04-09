import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import { Button } from '@/components/ui/button'
import { getRosters } from '@/lib/actions'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import RosterListTable from './_components/RosterListTable'

export default async function RosterPage({
  searchParams
}: {
  searchParams?: {
    page?: string
    searchTerm?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1
  const searchTerm = searchParams?.searchTerm || ''
  const rosterList = await getRosters(currentPage, searchTerm)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full items-center justify-between px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">부원명단</h1>
        <Link href="/console/roster/new">
          <Button variant="outline">부원 생성하기</Button>
        </Link>
      </div>
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <div className="flex max-w-[340px] items-center space-x-2">
          <SearchIcon className="h-6 w-6" />
          <Search placeholder="이름 검색" />
        </div>
        <RosterListTable rosters={rosterList.rosters} />
        <Pagination
          totalPages={calculateTotalPages(
            rosterList.total,
            PAGINATION_LIMIT_DEFAULT
          )}
        />
      </div>
    </main>
  )
}
