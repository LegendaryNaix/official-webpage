import { Body, Controller, Get, Put, Req } from '@nestjs/common'
import { AuthenticatedRequest } from '@libs/auth'
import { BusinessExceptionHandler } from '@libs/exception'
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
}
