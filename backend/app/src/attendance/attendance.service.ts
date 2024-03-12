import { Service } from '@libs/decorator'
import { EntityNotExistException, UnexpectedException } from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { calculatePaginationOffset } from '@libs/utils'
import { Prisma } from '@prisma/client'
import type {
  AttendanceWithRoster,
  CreateAttendanceDTO
} from './dto/attendance.dto'

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
    searchTerm: string,
    page: number,
    limit = 10
  ): Promise<{ attendances: AttendanceWithRoster[] }> {
    try {
      const attendances = await this.prisma.attendance.findMany({
        where: {
          scheduleId,
          Roster: {
            OR: [
              {
                offPosition: {
                  contains: searchTerm
                },
                defPosition: {
                  contains: searchTerm
                },
                splPosition: {
                  contains: searchTerm
                }
              }
            ]
          }
        },
        include: {
          Roster: {
            select: {
              id: true,
              name: true,
              type: true,
              registerYear: true,
              offPosition: true,
              defPosition: true,
              splPosition: true
            }
          }
        },
        take: limit,
        skip: calculatePaginationOffset(page, limit),
        orderBy: {
          Roster: {
            name: 'asc'
          }
        }
      })

      return { attendances }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }
}
