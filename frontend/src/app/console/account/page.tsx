import Pagination from '@/components/Pagination'
import { getUsers } from '@/lib/actions'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'
import UserListTable from './_component/UserListTable'

export default async function AccountPage({
  searchParams
}: {
  searchParams?: {
    page?: string
  }
}) {
  const currentPage = Number(searchParams?.page) || 1
  const userList = await getUsers(currentPage)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center">
      <div className="mt-4 w-full px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">계정목록</h1>
      </div>
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <UserListTable users={userList.users} />
        <Pagination
          totalPages={calculateTotalPages(
            userList.total,
            PAGINATION_LIMIT_DEFAULT
          )}
        />
      </div>
    </main>
  )
}
