import { Service } from '@libs/decorator'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { calculatePaginationOffset } from '@libs/utils'
import {
  Prisma,
  RosterType,
  type Attendance,
  type Roster,
  AttendanceResponse,
  AttendanceLocation
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictFoundException('이미 제출한 출석조사입니다')
        }
        if (error.code === 'P2003') {
          throw new EntityNotExistException('로스터가 존재하지 않습니다')
        }
      }
      throw new UnexpectedException(error)
    }
  }

  async getUncheckedAttendances(
    scheduleId: number,
    page: number,
    limit = 1
  ): Promise<{ attendances: AttendanceWithRoster[]; total: number }> {
    try {
      const attendances = await this.prisma.attendance.findMany({
        where: {
          scheduleId,
          result: null
        },
        skip: calculatePaginationOffset(page, limit),
        take: limit,
        include: {
          Roster: true
        }
      })

      const total = await this.prisma.attendance.count({
        where: {
          scheduleId,
          result: null
        }
      })

      return { attendances, total }
    } catch (error) {
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

  async getAttendanceGroupedByRosterType(scheduleId: number) {
    try {
      const attendances = await this.prisma.attendance.findMany({
        where: {
          scheduleId
        },
        include: {
          Roster: true
        }
      })

      const statistics = attendances.map((attendance) => {
        return {
          type: attendance.Roster.type,
          isNewbie: attendance.Roster.registerYear === new Date().getFullYear(),
          response: attendance.response,
          location: attendance.location
        }
      })

      const athleteStatistics = statistics.filter(
        (item) => item.type === RosterType.Athlete && !item.isNewbie
      )

      const athleteNewbieStatistics = statistics.filter(
        (item) => item.type === RosterType.Athlete && item.isNewbie
      )

      const staffStatistics = statistics.filter(
        (item) => item.type === RosterType.Staff && !item.isNewbie
      )

      const staffNewbieStatistics = statistics.filter(
        (item) => item.type === RosterType.Staff && item.isNewbie
      )

      return {
        athlete: {
          total: athleteStatistics.filter(
            (item) => item.response !== AttendanceResponse.Absence
          ).length,
          seoul: athleteStatistics.filter(
            (item) =>
              item.response !== AttendanceResponse.Absence &&
              item.location === AttendanceLocation.Seoul
          ).length,
          suwon: athleteStatistics.filter(
            (item) =>
              item.response !== AttendanceResponse.Absence &&
              item.location === AttendanceLocation.Suwon
          ).length,
          absence: athleteStatistics.filter(
            (item) => item.response === AttendanceResponse.Absence
          ).length
        },
        athleteNewbie: {
          total: athleteNewbieStatistics.filter(
            (item) => item.response !== AttendanceResponse.Absence
          ).length,
          seoul: athleteNewbieStatistics.filter(
            (item) =>
              item.response !== AttendanceResponse.Absence &&
              item.location === AttendanceLocation.Seoul
          ).length,
          suwon: athleteNewbieStatistics.filter(
            (item) =>
              item.response !== AttendanceResponse.Absence &&
              item.location === AttendanceLocation.Suwon
          ).length,
          absence: athleteNewbieStatistics.filter(
            (item) => item.response === AttendanceResponse.Absence
          ).length
        },
        staff: {
          total: staffStatistics.filter(
            (item) => item.response !== AttendanceResponse.Absence
          ).length,
          seoul: staffStatistics.filter(
            (item) =>
              item.response !== AttendanceResponse.Absence &&
              item.location === AttendanceLocation.Seoul
          ).length,
          suwon: staffStatistics.filter(
            (item) =>
              item.response !== AttendanceResponse.Absence &&
              item.location === AttendanceLocation.Suwon
          ).length,
          absence: staffStatistics.filter(
            (item) => item.response === AttendanceResponse.Absence
          ).length
        },
        staffNewbie: {
          total: staffNewbieStatistics.filter(
            (item) => item.response !== AttendanceResponse.Absence
          ).length,
          seoul: staffNewbieStatistics.filter(
            (item) =>
              item.response !== AttendanceResponse.Absence &&
              item.location === AttendanceLocation.Seoul
          ).length,
          suwon: staffNewbieStatistics.filter(
            (item) =>
              item.response !== AttendanceResponse.Absence &&
              item.location === AttendanceLocation.Suwon
          ).length,
          absence: staffNewbieStatistics.filter(
            (item) => item.response === AttendanceResponse.Absence
          ).length
        }
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
          ...attendanceDTO
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
