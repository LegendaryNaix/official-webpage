import CreateSurveySection from './_components/CreateSurveySection'

export default function CreateSurveyGroupPage() {
  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center">
      <div className="flex w-full flex-grow flex-col gap-5 py-4 sm:px-6">
        <CreateSurveySection />
      </div>
    </main>
  )
}
