import { Module } from '@nestjs/common'
import { AttendanceModule } from '@/attendance/attendance.module'
import { RosterModule } from '@/roster/roster.module'
import { SurveyController } from './survey.controller'
import { SurveyService } from './survey.service'

@Module({
  imports: [RosterModule, AttendanceModule],
  controllers: [SurveyController],
  providers: [SurveyService]
})
export class SurveyModule {}
