import { Service } from '@libs/decorator'
import { EntityNotExistException, UnexpectedException } from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { calculatePaginationOffset } from '@libs/utils'
import { Prisma, type Schedule, type SurveyGroup } from '@prisma/client'
import type { CreateScheduleDTO, UpdateScheduleDTO } from './dto/schedule.dto'
import type {
  CreateSurveyGroupDTO,
  UpdateSurveyGroupDTO
} from './dto/surveyGroup.dto'

@Service()
export class SurveyService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createSurveyGroup(
    surveyGroupDTO: CreateSurveyGroupDTO
  ): Promise<SurveyGroup> {
    try {
      return await this.prisma.surveyGroup.create({
        data: surveyGroupDTO
      })
    } catch (error) {
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
}
