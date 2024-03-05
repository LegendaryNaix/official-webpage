import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Service } from '@libs/decorator'
import {
  BusinessException,
  EntityNotExistException,
  UnexpectedException
} from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { StorageService } from '@libs/storage'
import { calculatePaginationOffset, formatFileUrl } from '@libs/utils'
import { Prisma } from '@prisma/client'
import type { UpdateUserProfileDTO } from './dto/user.dto'

@Service()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ImageStorageService')
    private readonly imageStorageService: StorageService,
    private readonly configService: ConfigService
  ) {}

  async getUserProfile(userId: number) {
    try {
      const userWithProfile = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          username: true,
          nickname: true,
          role: true,
          email: true,
          lastLogin: true,
          profileImageUrl: true
        }
      })

      if (userWithProfile.profileImageUrl) {
        userWithProfile.profileImageUrl = formatFileUrl(
          userWithProfile.profileImageUrl
        )
      }

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

  async getUsers(page: number, limit = 10) {
    const users = await this.prisma.user.findMany({
      skip: calculatePaginationOffset(page, limit),
      take: limit,
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        email: true,
        lastLogin: true,
        profileImageUrl: true,
        status: true
      }
    })

    const total = await this.prisma.user.count()
    return { users, total }
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

  async updateProfileImage(userId: number, image: Express.Multer.File) {
    try {
      const profile = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId
        },
        select: {
          profileImageUrl: true
        }
      })

      if (profile.profileImageUrl) {
        this.imageStorageService.deleteObject(profile.profileImageUrl)
      }

      const result = await this.imageStorageService.uploadObject(
        image,
        `user/${userId}/profile`
      )

      return await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          profileImageUrl: result.src
        },
        select: {
          profileImageUrl: true
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) throw error
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
