import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.use(cookieParser())
  app.setGlobalPrefix('api')

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://skku-royals.vercel.app'
        : 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['*'],
    exposedHeaders: ['Content-Type', 'Authorization']
  })

  await app.listen(4000)
}

bootstrap()
