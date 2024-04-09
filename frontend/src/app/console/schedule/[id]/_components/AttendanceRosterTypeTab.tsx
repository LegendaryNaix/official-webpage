'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RosterType } from '@/lib/enums'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

enum ExtendedRosterType {
  Athlete = 'Athlete',
  AthleteNewbie = 'AthleteNewbie',
  Staff = 'Staff',
  StaffNewbie = 'StaffNewbie',
  Coach = 'Coach',
  HeadCoach = 'HeadCoach'
}

export default function AttendanceRosterTypeTab() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleClick = (type: ExtendedRosterType, newbie: boolean) => {
    const params = new URLSearchParams(searchParams)

    let rosterType

    switch (type) {
      case ExtendedRosterType.Athlete:
      case ExtendedRosterType.AthleteNewbie:
        rosterType = RosterType.Athlete
        break
      case ExtendedRosterType.Staff:
      case ExtendedRosterType.StaffNewbie:
        rosterType = RosterType.Staff
        break
      case ExtendedRosterType.HeadCoach:
        rosterType = RosterType.HeadCoach
        break
      default:
        rosterType = RosterType.Coach
    }

    params.set('type', rosterType)
    params.set('newbie', newbie.toString())
    params.set('searchTerm', '')
    params.set('page', '1')

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs className="overflow-x-auto" defaultValue={ExtendedRosterType.Athlete}>
      <TabsList>
        <TabsTrigger
          onClick={() => handleClick(ExtendedRosterType.Athlete, false)}
          value={ExtendedRosterType.Athlete}
        >
          선수(재학생)
        </TabsTrigger>
        <TabsTrigger
          onClick={() => handleClick(ExtendedRosterType.AthleteNewbie, true)}
          value={ExtendedRosterType.AthleteNewbie}
        >
          선수(신입생)
        </TabsTrigger>
        <TabsTrigger
          onClick={() => handleClick(ExtendedRosterType.Staff, false)}
          value={ExtendedRosterType.Staff}
        >
          스태프(재학생)
        </TabsTrigger>
        <TabsTrigger
          onClick={() => handleClick(ExtendedRosterType.StaffNewbie, true)}
          value={ExtendedRosterType.StaffNewbie}
        >
          스태프(신입생)
        </TabsTrigger>
        <TabsTrigger
          onClick={() => handleClick(ExtendedRosterType.HeadCoach, false)}
          value={ExtendedRosterType.HeadCoach}
        >
          감독
        </TabsTrigger>
        <TabsTrigger
          onClick={() => handleClick(ExtendedRosterType.Coach, false)}
          value={ExtendedRosterType.Coach}
        >
          코치
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
