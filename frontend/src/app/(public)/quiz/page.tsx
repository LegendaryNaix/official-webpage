import type { Metadata } from 'next'
import QuizSection from './_components/QuizSection'
import StudentIdForm from './_components/StudentIdForm'

export const metadata: Metadata = {
  title: '로얄스 골든벨',
  description: '당신은 얼마나 로얄스에 미쳐있나요?'
}

export default function QuizPage({
  searchParams
}: {
  searchParams?: { studentId: string }
}) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center p-6 lg:px-8">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-y-10">
        {searchParams?.studentId ? (
          <QuizSection
            answers={[1, 3, 1, 2, 3, 4, 3, 2, 4, 3]}
            studentId={searchParams.studentId}
          />
        ) : (
          <div className="flex w-full flex-col items-center">
            <h1 className="text-3xl font-bold text-amber-400">로얄스 골든벨</h1>
            <h1 className="mb-10 text-base">
              나는 얼마나 로얄스에 미쳐있는가? (총 10문제)
            </h1>
            <StudentIdForm />
          </div>
        )}
      </div>
    </main>
  )
}
