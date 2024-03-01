import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedRequest } from '@libs/auth'
import { BusinessExceptionHandler } from '@libs/exception'
import { IMAGE_OPTIONS } from '@libs/storage'
import { UpdateUserProfileDTO } from './dto/user.dto'
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
}
