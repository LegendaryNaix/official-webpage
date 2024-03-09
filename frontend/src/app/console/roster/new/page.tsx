import CreateRosterSection from './_components/CreateRosterSection'

export default function CreateRoster() {
  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center">
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <CreateRosterSection />
      </div>
    </main>
  )
}
