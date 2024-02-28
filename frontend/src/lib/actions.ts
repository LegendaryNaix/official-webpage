'use server'

import fetcher from './fetcher'
import type { UserProfile } from './types/user'

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const profile = await fetcher.get<UserProfile>('/user')

  return profile
}
