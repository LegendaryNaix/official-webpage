import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res
} from '@nestjs/common'
import { Roles } from '@libs/decorator'
import { BusinessExceptionHandler } from '@libs/exception'
import { Role, type Attendance } from '@prisma/client'
import { Response } from 'express'
import { AttendanceService } from './attendance.service'
import {
  type AttendanceWithRoster,
  UpdateAttendanceDTO
} from './dto/attendance.dto'

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
    @Query('newbie', new ParseBoolPipe({ optional: true })) newbie?: boolean,
    @Query('rosterType') rosterType?: string
  ): Promise<{ attendances: AttendanceWithRoster[]; total: number }> {
    try {
      return await this.attendanceService.getAttendances(
        scheduleId,
        searchTerm,
        page,
        rosterType,
        newbie,
        limit
      )
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Get('excel-file')
  @Roles(Role.Manager)
  async getAttendancesWithExcel(
    @Query('scheduleId', ParseIntPipe) scheduleId: number,
    @Res() res: Response
  ) {
    try {
      const excelBuffer =
        await this.attendanceService.getAttendancesWithExcelFile(scheduleId)

      res.set({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      res.end(excelBuffer)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Get('unchecked')
  @Roles(Role.Manager)
  async getUncheckedAttendances(
    @Query('scheduleId', ParseIntPipe) scheduleId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('response') response: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<{ attendances: AttendanceWithRoster[]; total: number }> {
    try {
      return await this.attendanceService.getUncheckedAttendances(
        scheduleId,
        response,
        page,
        limit
      )
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Get('statistic')
  @Roles(Role.Manager)
  async getAttendanceGroupedByRosterType(
    @Query('scheduleId', ParseIntPipe) scheduleId: number
  ) {
    try {
      return await this.attendanceService.getAttendanceGroupedByRosterType(
        scheduleId
      )
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Put(':attendanceId')
  @Roles(Role.Manager)
  async updateAttendance(
    @Param('attendanceId', ParseIntPipe) attendanceId: number,
    @Body() attendanceDTO: UpdateAttendanceDTO
  ): Promise<Attendance> {
    try {
      return await this.attendanceService.updateAttendance(
        attendanceId,
        attendanceDTO
      )
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Post(':attendanceId/check')
  @Roles(Role.Manager)
  async checkAttendance(
    @Param('attendanceId', ParseIntPipe) attendanceId: number,
    @Body() attendanceDTO: UpdateAttendanceDTO
  ): Promise<Attendance> {
    try {
      return await this.attendanceService.checkAttendance(
        attendanceId,
        attendanceDTO
      )
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }
}
