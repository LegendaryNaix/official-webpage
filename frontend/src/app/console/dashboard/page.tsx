import { NoticeSection } from './_components/NoticeSection'
import { ProfileSection } from './_components/ProfileSection'

export default function ConsoleHome() {
  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center">
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6 md:grid md:grid-cols-12">
        <div className="col-span-12 grid h-full grid-cols-12 gap-5 md:h-1/4">
          <div className="col-span-12 overflow-hidden md:col-span-6 lg:col-span-4">
            <ProfileSection />
          </div>
          <div className="col-span-12 overflow-hidden md:col-span-6 lg:col-span-8">
            <NoticeSection />
          </div>
        </div>
      </div>
    </main>
  )
}
