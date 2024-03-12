import type { Schedule } from './schedule'

type SurveyGroupBasic = {
  id: number
  name: string
  startedAt: string
  endedAt: string
  required: boolean
}

export interface SurveyGroupListItem extends SurveyGroupBasic {}

export interface SurveyGroupList {
  total: number
  surveyGroups: SurveyGroupListItem[]
}

export interface SurveyGroupWithSchedules {
  surveyGroup: SurveyGroupBasic
  schedules: Schedule[]
}
