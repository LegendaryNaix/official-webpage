import type { Metadata } from 'next'
import SurveyGroupCardSection from './_components/SurveyGroupCardSection'

export const metadata: Metadata = {
  title: '출석조사 목록',
  description: '성균관대학교 미식축구부 로얄스 홈페이지',
  openGraph: {
    images: ['/survey-og.png']
  }
}

export default async function SurveyPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-start p-6 lg:px-8">
      <div className="flex w-full flex-col items-center gap-y-10">
        <SurveyGroupCardSection />
      </div>
    </main>
  )
}
