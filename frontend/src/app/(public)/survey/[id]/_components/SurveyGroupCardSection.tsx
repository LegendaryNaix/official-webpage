import { getSurveyGroup } from '@/lib/actions'
import SurveyGroupCard from './SurveyGroupCard'

export default async function SurveyGroupCardSection({
  params
}: {
  params: { id: number }
}) {
  const surveyGroup = await getSurveyGroup(params.id)

  return (
    <section className="w-full">
      <h1 className="mb-3 text-lg font-bold sm:text-xl">선택한 출석조사</h1>
      <SurveyGroupCard surveyGroup={surveyGroup} />
    </section>
  )
}
