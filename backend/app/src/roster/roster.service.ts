import { Service } from '@libs/decorator'
import { PrismaService } from '@libs/prisma'

@Service()
export class RosterService {
  constructor(private readonly prisma: PrismaService) {}
}
