import { Service } from '@libs/decorator'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { QuizScoreDTO } from './dto/quiz.dto'

@Service()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  async getQuizRank() {
    try {
      const newbie = await this.prismaService.quiz.findMany({
        take: 5,
        where: {
          Roster: {
            registerYear: new Date().getFullYear()
          }
        },
        include: {
          Roster: {
            select: {
              name: true,
              admissionYear: true
            }
          }
        },
        orderBy: [
          {
            score: 'desc'
          },
          {
            createdAt: 'asc'
          }
        ]
      })

      const senior = await this.prismaService.quiz.findMany({
        take: 5,
        where: {
          Roster: {
            registerYear: {
              not: new Date().getFullYear()
            }
          }
        },
        include: {
          Roster: {
            select: {
              name: true,
              admissionYear: true
            }
          }
        },
        orderBy: [
          {
            score: 'desc'
          },
          {
            createdAt: 'asc'
          }
        ]
      })

      return { newbie, senior }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async registerQuizScore(quizDTO: QuizScoreDTO) {
    try {
      const { id } = await this.prismaService.roster.findUniqueOrThrow({
        where: {
          studentId: quizDTO.studentId
        }
      })

      return await this.prismaService.quiz.create({
        data: {
          rosterId: id,
          score: quizDTO.score
        }
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003' || error.code === 'P2025') {
          throw new EntityNotExistException('존재하지 않는 학번입니다')
        }
        if (error.code === 'P2002') {
          throw new ConflictFoundException('이미 퀴즈를 제출하였습니다')
        }
      }
      throw new UnexpectedException(error)
    }
  }
}
