'use server'

import fetcher from './fetcher'
import type { RosterList } from './types/roster'
import type {
  SurveyGroupList,
  SurveyGroupListItem,
  SurveyGroupWithSchedules
} from './types/survey'
import type { UserList, UserProfile } from './types/user'
import { PAGINATION_LIMIT_DEFAULT } from './vars'

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  return await fetcher.get<UserProfile>('/user')
}

export const getUsers = async (page: number): Promise<UserList> => {
  return await fetcher.get<UserList>(
    `/user/list?page=${page}&limit=${PAGINATION_LIMIT_DEFAULT}`
  )
}

export const getRosters = async (page: number): Promise<RosterList> => {
  return await fetcher.get<RosterList>(
    `/rosters?page=${page}&limit=${PAGINATION_LIMIT_DEFAULT}&filter=Enable`
  )
}

export const getSurveyGroup = async (
  surveyGroupId: number
): Promise<SurveyGroupListItem> => {
  return await fetcher.get(`/surveys/groups/${surveyGroupId}`)
}

export const getSurveyGroups = async (
  page: number
): Promise<SurveyGroupList> => {
  return await fetcher.get<SurveyGroupList>(
    `/surveys/groups?page=${page}&limit=${PAGINATION_LIMIT_DEFAULT}`
  )
}

export const getSurveyGroupWithSchedules = async (
  surveyGroupId: number
): Promise<SurveyGroupWithSchedules> => {
  return await fetcher.get<SurveyGroupWithSchedules>(
    `/surveys/groups/${surveyGroupId}/schedules`
  )
}
