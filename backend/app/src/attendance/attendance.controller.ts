import { Controller } from '@nestjs/common'
import { AttendanceService } from './attendance.service'

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
}
