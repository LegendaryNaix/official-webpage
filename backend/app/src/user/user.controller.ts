import { Controller, Get, Req } from '@nestjs/common'
import { AuthenticatedRequest } from '@libs/auth'
import { BusinessExceptionHandler } from '@libs/exception'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserProfile(@Req() req: AuthenticatedRequest) {
    try {
      return await this.userService.getUserProfile(req.user.username)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }
}
