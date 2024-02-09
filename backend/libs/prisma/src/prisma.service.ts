import type { OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Service } from '@libs/decorator'
import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

@Service()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL')
        }
      }
    })
  }

  async onModuleInit() {
    await this.$connect()
  }
}
