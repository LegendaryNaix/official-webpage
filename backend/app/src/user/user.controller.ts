import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedRequest } from '@libs/auth'
import { Public, Roles } from '@libs/decorator'
import { BusinessExceptionHandler } from '@libs/exception'
import { IMAGE_OPTIONS } from '@libs/storage'
import { Role } from '@prisma/client'
import {
  UpdateUserProfileDTO,
  type UpdateUserDTO,
  type ReducedUserDTO,
  type CreateUserDTO
} from './dto/user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserProfile(@Req() req: AuthenticatedRequest) {
    try {
      return await this.userService.getUserProfile(req.user.id)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Admin)
  @Get('list')
  async getUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    try {
      return await this.userService.getUsers(page, limit)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Put()
  async updateCurrentUserProfile(
    @Req() req: AuthenticatedRequest,
    @Body() userDTO: UpdateUserProfileDTO
  ) {
    try {
      return await this.userService.updateProfile(req.user.id, userDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Post()
  async signUp(@Body() userDTO: CreateUserDTO): Promise<ReducedUserDTO> {
    try {
      return await this.userService.signUp(userDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Post('verify-email')
  async verifyEmailAddress(
    @Query('email') email: string,
    @Query('pin') pin: string
  ): Promise<{ valid: boolean }> {
    try {
      return await this.userService.verifyEmailPin(email, pin)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Admin)
  @Put(':userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() userDTO: UpdateUserDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<ReducedUserDTO> {
    try {
      return await this.userService.updateUser(req.user.id, userId, userDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Put('profile-image')
  @UseInterceptors(FileInterceptor('image', IMAGE_OPTIONS))
  async updateCurrentUserProfileImage(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() image: Express.Multer.File
  ) {
    if (!image) {
      throw new BadRequestException('Invalid image format or size')
    }

    try {
      return await this.userService.updateProfileImage(req.user.id, image)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Admin)
  @Post('temp')
  async createTempUser(
    @Body() userDTO: CreateUserDTO
  ): Promise<ReducedUserDTO> {
    try {
      return await this.userService.createTempUser(userDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }
}
