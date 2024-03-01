import { Controller } from '@nestjs/common'
import { RosterService } from './roster.service'

@Controller()
export class RosterController {
  constructor(private readonly rosterService: RosterService) {}
}
