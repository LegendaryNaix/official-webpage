import { getSurveyGroupWithSchedules } from '@/lib/actions'
import SubmitSurveyForm from './SubmitSurveyForm'
import SurveyGroupCard from './SurveyGroupCard'

export default async function SubmitSurveySection({
  params,
  searchParams
}: {
  params: { id: number }
  searchParams?: { studentId?: string }
}) {
  const { surveyGroup, schedules } = await getSurveyGroupWithSchedules(
    params.id
  )

  return (
    <section>
      <SurveyGroupCard surveyGroup={surveyGroup} />
      {searchParams?.studentId && (
        <SubmitSurveyForm
          schedules={schedules}
          studentId={searchParams.studentId}
          surveyGroupId={params.id}
        />
      )}
    </section>
  )
}
