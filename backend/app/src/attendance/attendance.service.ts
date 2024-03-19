import { Service } from '@libs/decorator'
import { EntityNotExistException, UnexpectedException } from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { calculatePaginationOffset } from '@libs/utils'
import {
  Prisma,
  RosterType,
  type Attendance,
  type Roster
} from '@prisma/client'
import type {
  AttendanceWithRoster,
  CreateAttendanceDTO,
  UpdateAttendanceDTO
} from './dto/attendance.dto'

export type AttendanceCount = {
  present: number
  absence: number
  tardy: number
}

@Service()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createAttendances(
    rosterId: number,
    attendances: CreateAttendanceDTO[]
  ): Promise<{ count: number }> {
    try {
      const attendancesWithRosterId = attendances.map((attendance) => {
        return {
          ...attendance,
          rosterId
        }
      })
      return await this.prisma.attendance.createMany({
        data: attendancesWithRosterId
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('로스터가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async getAttendances(
    scheduleId: number,
    searchTerm = '',
    page: number,
    rosterType?: string,
    limit = 10
  ): Promise<{ attendances: AttendanceWithRoster[]; total: number }> {
    try {
      const attendances = await this.prisma.attendance.findMany({
        where: {
          scheduleId,
          Roster: {
            AND: [
              {
                type: this.transformRosterType(rosterType)
              },
              {
                OR: [
                  {
                    offPosition: {
                      contains: searchTerm
                    }
                  },
                  {
                    defPosition: {
                      contains: searchTerm
                    }
                  },
                  {
                    splPosition: {
                      contains: searchTerm
                    }
                  }
                ]
              }
            ]
          }
        },
        include: {
          Roster: true
        },
        take: limit,
        skip: calculatePaginationOffset(page, limit),
        orderBy: [
          {
            Roster: {
              admissionYear: 'asc'
            }
          },
          {
            Roster: {
              name: 'asc'
            }
          }
        ]
      })

      const total = await this.prisma.attendance.count({
        where: {
          scheduleId,
          Roster: {
            AND: [
              {
                type: this.transformRosterType(rosterType)
              },
              {
                OR: [
                  {
                    offPosition: {
                      contains: searchTerm
                    }
                  },
                  {
                    defPosition: {
                      contains: searchTerm
                    }
                  },
                  {
                    splPosition: {
                      contains: searchTerm
                    }
                  }
                ]
              }
            ]
          }
        }
      })

      return { attendances, total }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async getAttendancesGroupedByPosition(scheduleId: number) {
    try {
      const athleteAttendances = await this.prisma.attendance.findMany({
        where: {
          scheduleId,
          Roster: {
            registerYear: {
              not: new Date().getFullYear()
            },
            type: RosterType.Athlete
          }
        },
        include: {
          Roster: true
        }
      })

      const athleteNewbieAttendances = await this.prisma.attendance.findMany({
        where: {
          scheduleId,
          Roster: {
            registerYear: new Date().getFullYear(),
            type: RosterType.Athlete
          }
        },
        include: {
          Roster: true
        }
      })

      const staffAttendances = await this.prisma.attendance.findMany({
        where: {
          scheduleId,
          Roster: {
            type: RosterType.Staff
          }
        },
        include: {
          Roster: true
        }
      })

      return {
        athlete: this.calculateAthleteAttendances(athleteAttendances),
        athleteNewbie: this.calculateAthleteAttendances(
          athleteNewbieAttendances
        ),
        staff: this.calculateStaffAttendances(staffAttendances)
      }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async checkAttendance(
    attendanceId: number,
    attendanceDTO: UpdateAttendanceDTO
  ): Promise<Attendance> {
    try {
      return await this.prisma.attendance.update({
        where: {
          id: attendanceId
        },
        data: {
          result: attendanceDTO.result
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('출결정보가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async updateAttendance(
    attendanceId: number,
    attendanceDTO: UpdateAttendanceDTO
  ): Promise<Attendance> {
    try {
      return await this.prisma.attendance.update({
        where: {
          id: attendanceId
        },
        data: {
          location: attendanceDTO.location,
          response: attendanceDTO.response,
          reason: attendanceDTO.reason
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('출결정보가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  private calculateStaffAttendances(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    attendancesWithRosters: (Attendance & { Roster: Roster })[]
  ): Record<string, Record<string, AttendanceCount>> {
    const positionCounts = {
      staff: {
        normal: {
          present: 0,
          absence: 0,
          tardy: 0
        },
        newbie: {
          present: 0,
          absence: 0,
          tardy: 0
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    attendancesWithRosters.forEach(({ Roster, response }) => {
      const isNewbie = Roster.registerYear === new Date().getFullYear()
      const counts = positionCounts['staff'][isNewbie ? 'newbie' : 'normal']

      switch (response) {
        case 'Present':
          counts.present++
          break
        case 'Absence':
          counts.absence++
          break
        case 'Tardy':
          counts.tardy++
          break
      }
    })

    return positionCounts
  }

  private calculateAthleteAttendances(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    attendancesWithRosters: (Attendance & { Roster: Roster })[]
  ): Record<string, Record<string, AttendanceCount>> {
    const positionCounts = {
      off: {},
      def: {},
      spl: {}
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    attendancesWithRosters.forEach(({ Roster, response }) => {
      const updateCounts = (
        positionType: string,
        positionValue: string | null
      ) => {
        if (positionValue) {
          if (!positionCounts[positionType][positionValue]) {
            positionCounts[positionType][positionValue] = {
              present: 0,
              absence: 0,
              tardy: 0
            }
          }

          const counts = positionCounts[positionType][positionValue]

          switch (response) {
            case 'Present':
              counts.present++
              break
            case 'Absence':
              counts.absence++
              break
            case 'Tardy':
              counts.tardy++
              break
          }
        }
      }

      updateCounts('off', Roster.offPosition)
      updateCounts('def', Roster.defPosition)
      updateCounts('spl', Roster.splPosition)
    })

    return positionCounts
  }

  private transformRosterType(rosterType: string): RosterType {
    try {
      return RosterType[rosterType]
    } catch (error) {
      return RosterType.Athlete
    }
  }
}
