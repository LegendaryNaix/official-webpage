import { Service } from '@libs/decorator'
import { PrismaService } from '@libs/prisma'

@Service()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello World!'
  }
}
