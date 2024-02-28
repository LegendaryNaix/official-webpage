import { Service } from '@libs/decorator'
import { EntityNotExistException, UnexpectedException } from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { Prisma } from '@prisma/client'
import type { UpdateUserProfileDTO } from './dto/user.dto'

@Service()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    try {
      const userWithProfile = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          username: true,
          nickname: true,
          role: true,
          email: true,
          lastLogin: true
        }
      })

      return userWithProfile
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('계정정보가 존재하지 않습니다')
      }

      throw new UnexpectedException(error)
    }
  }

  async updateProfile(userId: number, userDTO: UpdateUserProfileDTO) {
    try {
      return await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          ...userDTO
        },
        select: {
          id: true,
          nickname: true,
          email: true
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('계정정보가 존재하지 않습니다')
      }

      throw new UnexpectedException(error)
    }
  }

  async getUserCredential(username: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { username }
      })

      return user
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('계정정보가 존재하지 않습니다')
      }

      throw new UnexpectedException(error)
    }
  }

  async updateLastLogin(username: string) {
    try {
      await this.prisma.user.update({
        where: { username },
        data: { lastLogin: new Date() }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('계정정보가 존재하지 않습니다')
      }

      throw new UnexpectedException(error)
    }
  }
}
