import { Service } from '@libs/decorator'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { calculatePaginationOffset, formatFileUrl } from '@libs/utils'
import {
  Prisma,
  RosterType,
  type Attendance,
  AttendanceResponse,
  AttendanceLocation
} from '@prisma/client'
import * as XLSX from 'xlsx'
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
    response: string,
    page: number,
    limit = 1
  ): Promise<{ attendances: AttendanceWithRoster[]; total: number }> {
    try {
      const attendances = await this.prisma.attendance.findMany({
        where: {
          scheduleId,
          result: null,
          response: this.transformAttendanceResponse(response)
        },
        skip: calculatePaginationOffset(page, limit),
        take: limit,
        include: {
          Roster: true
        },
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

      attendances.forEach((attendance) => {
        if (attendance.Roster.profileImageUrl) {
          attendance.Roster.profileImageUrl = formatFileUrl(
            attendance.Roster.profileImageUrl
          )
        }
      })

      const total = await this.prisma.attendance.count({
        where: {
          scheduleId,
          result: null,
          response: this.transformAttendanceResponse(response)
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

      attendances.forEach((attendance) => {
        if (attendance.Roster.profileImageUrl) {
          attendance.Roster.profileImageUrl = formatFileUrl(
            attendance.Roster.profileImageUrl
          )
        }
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

  async getAttendancesWithExcelFile(scheduleId: number) {
    try {
      const attendancesWithRoster = await this.prisma.attendance.findMany({
        where: {
          scheduleId
        },
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
        ],
        include: {
          Roster: true
        }
      })

      const attendances = attendancesWithRoster.map((item) => {
        return {
          이름: item.Roster.name,
          학번: item.Roster.admissionYear,
          입부년도: item.Roster.registerYear,
          출석조사: this.translateAttendanceResponse(item.response),
          위치: this.translateAttendanceLocation(item.location),
          실제출석: this.translateAttendanceResponse(item.result),
          사유: item.reason ?? '',
          구분: this.translateRosterType(item.Roster.type),
          오펜스: item.Roster.offPosition ?? '',
          디펜스: item.Roster.defPosition ?? '',
          스페셜: item.Roster.splPosition ?? ''
        }
      })

      const workbook = XLSX.utils.book_new()

      const athleteWorkSheet = XLSX.utils.json_to_sheet(
        attendances.filter(
          (attendance) =>
            attendance.구분 === '선수' &&
            attendance.입부년도 !== new Date().getFullYear()
        )
      )

      const staffWorkSheet = XLSX.utils.json_to_sheet(
        attendances.filter(
          (attendance) =>
            attendance.구분 === '스태프' &&
            attendance.입부년도 !== new Date().getFullYear()
        )
      )

      const newbieWorkSheet = XLSX.utils.json_to_sheet(
        attendances.filter(
          (attendance) => attendance.입부년도 === new Date().getFullYear()
        )
      )

      XLSX.utils.book_append_sheet(workbook, athleteWorkSheet, '재학생(선수)')
      XLSX.utils.book_append_sheet(workbook, staffWorkSheet, '재학생(스태프)')
      XLSX.utils.book_append_sheet(workbook, newbieWorkSheet, '신입생(전체)')

      return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  private translateRosterType(rosterType: RosterType): string {
    switch (rosterType) {
      case RosterType.Athlete:
        return '선수'
      case RosterType.Staff:
        return '스태프'
      default:
        return '감독 및 코치진'
    }
  }

  private translateAttendanceResponse(status: AttendanceResponse): string {
    switch (status) {
      case AttendanceResponse.Present:
        return '참석'
      case AttendanceResponse.Tardy:
        return '부분참석'
      case AttendanceResponse.Absence:
        return '불참'
      default:
        return '-'
    }
  }

  private translateAttendanceLocation(location: AttendanceLocation): string {
    switch (location) {
      case AttendanceLocation.Seoul:
        return '명륜'
      case AttendanceLocation.Suwon:
        return '율전'
      default:
        return ''
    }
  }

  private transformAttendanceResponse(response: string): AttendanceResponse {
    try {
      return AttendanceResponse[response]
    } catch (error) {
      return AttendanceResponse.Present
    }
  }

  private transformRosterType(rosterType: string): RosterType {
    try {
      return RosterType[rosterType]
    } catch (error) {
      return RosterType.Athlete
    }
  }
}
