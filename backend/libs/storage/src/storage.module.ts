import { Global, Module } from '@nestjs/common'
import { ImageStorageServiceImpl } from './image-storage.service'

@Global()
@Module({
  providers: [
    {
      provide: 'ImageStorageService',
      useClass: ImageStorageServiceImpl
    }
  ],
  exports: [
    {
      provide: 'ImageStorageService',
      useClass: ImageStorageServiceImpl
    }
  ]
})
export class StorageModule {}
