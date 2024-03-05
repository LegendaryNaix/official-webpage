import Pagination from '@/components/Pagination'
import { getUsers } from '@/lib/actions'
import { calculateTotalPages } from '@/lib/utils'
import { PAGINATION_LIMIT_DEFAULT } from '@/lib/vars'

export default async function ConsoleHome() {
  const userList = await getUsers(1)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center">
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6 md:grid md:grid-cols-12">
        <div className="col-span-12 grid h-full grid-cols-12 gap-5 md:h-1/4">
          <div className="mx-auto"></div>
        </div>
        <div className="col-span-12">
          <Pagination
            totalPages={calculateTotalPages(
              userList.total,
              PAGINATION_LIMIT_DEFAULT
            )}
          />
        </div>
      </div>
    </main>
  )
}
