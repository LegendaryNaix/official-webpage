import { Service } from '@libs/decorator'
import { PrismaService } from '@libs/prisma'

@Service()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}
}
