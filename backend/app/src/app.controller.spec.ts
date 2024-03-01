import { Test, type TestingModule } from '@nestjs/testing'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { PrismaService } from '@libs/prisma'
import { beforeEach, expect, it, describe } from 'vitest'

describe('AppController', () => {
  let appController: AppController

  const mockPrismaService = {}

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: mockPrismaService }
      ]
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthCheck()).toBe('Hello World!')
    })
  })
})
