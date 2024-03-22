import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common'
import { EmailService } from '@/email/email.service'
import { emailAuthenticationPinCacheKey } from '@libs/cache'
import { Service } from '@libs/decorator'
import {
  BusinessException,
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { StorageService } from '@libs/storage'
import {
  calculatePaginationOffset,
  createRandomString,
  formatFileUrl
} from '@libs/utils'
import { AccountStatus, Prisma, Role, type User } from '@prisma/client'
import { hash } from 'argon2'
import { Cache } from 'cache-manager'
import { instanceToPlain, plainToClass } from 'class-transformer'
import {
  ReducedUser,
  type CreateUserDTO,
  type ReducedUserDTO,
  type UpdateUserDTO,
  type UpdateUserProfileDTO
} from './dto/user.dto'

@Service()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ImageStorageService')
    private readonly imageStorageService: StorageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly emailService: EmailService
  ) {}

  async getUserProfile(userId: number): Promise<ReducedUserDTO> {
    try {
      const userWithProfile = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId }
      })

      if (userWithProfile.profileImageUrl) {
        userWithProfile.profileImageUrl = formatFileUrl(
          userWithProfile.profileImageUrl
        )
      }

      return this.removePassword(userWithProfile)
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

  async getUsers(
    page: number,
    limit = 10
  ): Promise<{ users: ReducedUserDTO[]; total: number }> {
    const userList = await this.prisma.user.findMany({
      skip: calculatePaginationOffset(page, limit),
      take: limit
    })

    const users = userList.map((user) => {
      return this.removePassword(user)
    })

    const total = await this.prisma.user.count()
    return { users, total }
  }

  async updateProfile(
    userId: number,
    userDTO: UpdateUserProfileDTO
  ): Promise<ReducedUserDTO> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          ...userDTO
        }
      })

      return this.removePassword(user)
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

  async updateUser(
    userId: number,
    userDTO: UpdateUserDTO
  ): Promise<ReducedUserDTO> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          ...userDTO
        }
      })

      return this.removePassword(user)
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

  async signUp(userDTO: CreateUserDTO): Promise<ReducedUserDTO> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...userDTO,
          password: await hash(userDTO.password),
          role: Role.User,
          status: AccountStatus.Disable
        }
      })

      await this.sendAuthPinEmail(user.email)

      return this.removePassword(user)
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictFoundException('아이디 또는 이메일이 이미 존재합니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async sendAuthPinEmail(email: string): Promise<{ result: string }> {
    try {
      const pin = createRandomString(6)

      await this.cacheManager.set(emailAuthenticationPinCacheKey(email), pin)

      await this.emailService.sendEmailAuthenticationPin(email, pin)

      return { result: 'ok' }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async verifyEmailPin(
    email: string,
    pin: string
  ): Promise<{ valid: boolean }> {
    try {
      const originPin = await this.cacheManager.get(
        emailAuthenticationPinCacheKey(email)
      )

      const valid = originPin === pin

      if (valid) {
        await this.prisma.user.update({
          where: {
            email
          },
          data: {
            status: AccountStatus.Verifying
          }
        })

        this.cacheManager.del(emailAuthenticationPinCacheKey(email))
      }

      return { valid }
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

  async verifyUser(userId: number): Promise<ReducedUserDTO> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          status: AccountStatus.Enable
        }
      })

      return this.removePassword(user)
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

  /**
   * 주의: 비밀번호를 포함함
   * @param username - 조회할 계정의 아이디
   * @returns {Promise<User>}
   */
  async getUserCredential(username: string): Promise<User> {
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

  async updateLastLogin(username: string): Promise<ReducedUserDTO> {
    try {
      const result = await this.prisma.user.update({
        where: { username },
        data: { lastLogin: new Date() }
      })

      return this.removePassword(result)
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

  private removePassword(user: User): ReducedUserDTO {
    const reducedUserInstance = plainToClass(ReducedUser, user)

    return instanceToPlain(reducedUserInstance, {
      excludeExtraneousValues: true
    }) as ReducedUserDTO
  }
}
