import { AttendanceService } from '@/attendance/attendance.service'
import { RosterService } from '@/roster/roster.service'
import { Service } from '@libs/decorator'
import {
  BusinessException,
  EntityNotExistException,
  UnexpectedException
} from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { calculatePaginationOffset } from '@libs/utils'
import {
  Prisma,
  RosterStatus,
  type Schedule,
  type SurveyGroup
} from '@prisma/client'
import type { CreateScheduleDTO, UpdateScheduleDTO } from './dto/schedule.dto'
import type {
  CreateSurveyGroupDTO,
  SubmitSurveyDTO,
  UpdateSurveyGroupDTO
} from './dto/surveyGroup.dto'

@Service()
export class SurveyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rosterService: RosterService,
    private readonly attendanceService: AttendanceService
  ) {}

  async getSurveyGroup(surveyGroupId: number): Promise<SurveyGroup> {
    try {
      return await this.prisma.surveyGroup.findUniqueOrThrow({
        where: {
          id: surveyGroupId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('출석조사 그룹이 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async getSurveyGroupWithSchedules(surveyGroupId: number): Promise<{
    surveyGroup: SurveyGroup
    schedules: Schedule[]
  }> {
    try {
      const surveyGroup = await this.prisma.surveyGroup.findUniqueOrThrow({
        where: {
          id: surveyGroupId
        }
      })

      const schedules = await this.prisma.schedule.findMany({
        where: {
          surveyGroupId
        },
        orderBy: {
          startedAt: 'asc'
        }
      })

      return { surveyGroup, schedules }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('출석조사 그룹이 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async getSurveyGroups(
    page: number,
    limit = 10
  ): Promise<{
    surveyGroups: SurveyGroup[]
    total: number
  }> {
    try {
      const surveyGroups = await this.prisma.surveyGroup.findMany({
        take: 10,
        skip: calculatePaginationOffset(page, limit),
        orderBy: {
          startedAt: 'desc'
        }
      })

      const total = await this.prisma.surveyGroup.count()

      return { surveyGroups, total }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async getSchedules(
    page: number,
    limit = 10
  ): Promise<{ schedules: Schedule[]; total: number }> {
    try {
      const schedules = await this.prisma.schedule.findMany({
        take: limit,
        skip: calculatePaginationOffset(page, limit),
        orderBy: {
          startedAt: 'desc'
        }
      })

      const total = await this.prisma.schedule.count()

      return { schedules, total }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async getSchedule(scheduleId: number): Promise<Schedule> {
    try {
      return await this.prisma.schedule.findUniqueOrThrow({
        where: {
          id: scheduleId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('일정이 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async createSurveyGroup(
    surveyGroupDTO: CreateSurveyGroupDTO
  ): Promise<SurveyGroup> {
    try {
      const surveyGroup = await this.prisma.surveyGroup.create({
        data: surveyGroupDTO
      })

      if (surveyGroupDTO.required)
        await this.createSurveyTargets(surveyGroup.id)

      return surveyGroup
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error)
    }
  }

  async updateSurveyGroup(
    surveyGroupId: number,
    surveyGroupDTO: UpdateSurveyGroupDTO
  ): Promise<SurveyGroup> {
    try {
      return await this.prisma.surveyGroup.update({
        where: {
          id: surveyGroupId
        },
        data: surveyGroupDTO
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('출석조사 그룹이 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async deleteSurveyGroup(surveyGroupId: number): Promise<SurveyGroup> {
    try {
      return await this.prisma.surveyGroup.delete({
        where: {
          id: surveyGroupId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('출석조사 그룹이 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async createSchedule(scheduleDTO: CreateScheduleDTO): Promise<Schedule> {
    try {
      return await this.prisma.schedule.create({
        data: scheduleDTO
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('출석조사 그룹이 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async updateSchedule(
    scheduleId: number,
    scheduleDTO: UpdateScheduleDTO
  ): Promise<Schedule> {
    try {
      return await this.prisma.schedule.update({
        where: {
          id: scheduleId
        },
        data: scheduleDTO
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003')
          throw new EntityNotExistException('출석조사 그룹이 존재하지 않습니다')
        if (error.code === 'P2025')
          throw new EntityNotExistException('스케쥴이 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async deleteSchedule(scheduleId: number): Promise<Schedule> {
    try {
      return await this.prisma.schedule.delete({
        where: {
          id: scheduleId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('스케쥴이 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async submitSurvey(
    surveyGroupId: number,
    surveyDTO: SubmitSurveyDTO
  ): Promise<{ count: number }> {
    try {
      const { studentId, attendances } = surveyDTO
      const roster = await this.rosterService.getRosterByStudentId(studentId)

      await this.prisma.surveyTarget.update({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          rosterId_surveyGroupId: {
            rosterId: roster.id,
            surveyGroupId
          }
        },
        data: {
          submit: true
        }
      })

      return await this.attendanceService.createAttendances(
        roster.id,
        attendances
      )
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('출석조사 대상이 아닙니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async getUnsubmitList(surveyGroupId: number) {
    try {
      const surveyTargets = await this.prisma.surveyTarget.findMany({
        where: {
          surveyGroupId,
          submit: false
        },
        select: {
          Roster: {
            select: {
              name: true,
              admissionYear: true,
              profileImageUrl: true
            }
          }
        }
      })

      const unsubmitList = surveyTargets.map((item) => {
        return {
          name: item.Roster.name,
          admissionYear: item.Roster.admissionYear,
          profileImageUrl: item.Roster.profileImageUrl
        }
      })

      return { rosters: unsubmitList }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('출석조사가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  private async createSurveyTargets(surveyGroupId: number): Promise<void> {
    try {
      const surveyTargetRosters = await this.prisma.roster.findMany({
        where: {
          status: RosterStatus.Enable
        },
        select: {
          id: true
        }
      })

      const surveyTargets = surveyTargetRosters.map((surveyTargetRoster) => {
        return {
          rosterId: surveyTargetRoster.id,
          surveyGroupId,
          submit: false
        }
      })

      await this.prisma.surveyTarget.createMany({
        data: surveyTargets
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('출석조사 그룹이 존재하지 않습니다')
      }
    }
  }
}
