import { Module } from '@nestjs/common'
import { RosterController } from './roster.controller'
import { RosterService } from './roster.service'

@Module({
  providers: [RosterService],
  controllers: [RosterController],
  exports: [RosterService]
})
export class RosterModule {}
