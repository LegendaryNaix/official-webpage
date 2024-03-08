import type { RosterStatus, RosterType } from '../enums'

type RosterBasic = {
  id: number
  name: string
  type: RosterType
  status: RosterStatus
  target: boolean
}

export interface Roster extends RosterBasic {
  studentId: string
  admissionYear: number
  profileImageUrl?: string
  registerYear: number
  offPosition?: string
  defPosition?: string
  splPosition?: string
  backNumber?: string
}

export interface RosterProfile extends RosterBasic {
  profileImageUrl?: string
  registerYear: number
  offPosition?: string
  defPosition?: string
  splPosition?: string
  backNumber?: string
}

export interface RosterListItem extends RosterProfile {
  studentId: string
  admissionYear: number
}

export interface RosterList {
  total: number
  rosters: RosterListItem[]
}
