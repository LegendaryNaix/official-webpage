'use server'

import fetcher from './fetcher'
import type { RosterList } from './types/roster'
import type { UserList, UserProfile } from './types/user'

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  return await fetcher.get<UserProfile>('/user')
}

export const getUsers = async (page: number): Promise<UserList> => {
  return await fetcher.get<UserList>(`/user/list?page=${page}&limit=10`)
}

export const getRosters = async (page: number): Promise<RosterList> => {
  return await fetcher.get<RosterList>(
    `/rosters?page=${page}&limit=10&filter=Enable`
  )
}
