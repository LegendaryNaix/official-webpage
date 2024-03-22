import { getRoster } from '@/lib/actions'
import UpdateRosterForm from './_components/UpdateRosterForm'

export default async function RosterPage({
  params
}: {
  params: {
    id: number
  }
}) {
  const roster = await getRoster(params.id)

  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full items-center justify-between px-4 text-left sm:px-6">
        <div className="flex w-full flex-col space-y-3">
          <h1 className="text-base font-bold sm:text-xl">부원정보수정</h1>
          <UpdateRosterForm roster={roster} />
        </div>
      </div>
    </main>
  )
}
