import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common'
import { Roles } from '@libs/decorator'
import { BusinessExceptionHandler } from '@libs/exception'
import { Role } from '@prisma/client'
import { AttendanceService } from './attendance.service'
import type { AttendanceWithRoster } from './dto/attendance.dto'

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('')
  @Roles(Role.Manager)
  async getAttendances(
    @Query('scheduleId', ParseIntPipe) scheduleId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('searchTerm') searchTerm: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('rosterType') rosterType?: string
  ): Promise<{ attendances: AttendanceWithRoster[]; total: number }> {
    try {
      return await this.attendanceService.getAttendances(
        scheduleId,
        searchTerm,
        page,
        rosterType,
        limit
      )
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }
}
