import { Module } from '@nestjs/common'
import { RosterService } from './roster.service'

@Module({
  providers: [RosterService],
  controllers: []
})
export class RosterModule {}
