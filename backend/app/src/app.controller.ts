import { Controller, Get } from '@nestjs/common'
import { Public } from '@libs/decorator'
import { AppService } from './app.service'

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Used for aws ecs health-check
   */
  @Get('test')
  healthCheck(): string {
    return this.appService.getHello()
  }
}
