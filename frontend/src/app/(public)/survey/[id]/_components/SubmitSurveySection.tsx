import { getSurveyGroupWithSchedules } from '@/lib/actions'
import SubmitSurveyForm from './SubmitSurveyForm'

export default async function SubmitSurveySection({
  params,
  searchParams
}: {
  params: { id: number }
  searchParams?: { studentId?: string }
}) {
  const { schedules } = await getSurveyGroupWithSchedules(params.id)

  return (
    <section>
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
