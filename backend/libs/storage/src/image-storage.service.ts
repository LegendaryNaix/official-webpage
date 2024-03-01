import { ConfigService } from '@nestjs/config'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { Service } from '@libs/decorator'
import {
  ParameterValidationException,
  UnexpectedException
} from '@libs/exception'
import mime from 'mime-types'
import { v4 as uuidv4 } from 'uuid'
import type { ImageStorageService } from './storage.interface'

@Service()
export class ImageStorageServiceImpl implements ImageStorageService {
  private readonly s3: S3Client

  constructor(private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') === 'production') {
      this.s3 = new S3Client()
    } else {
      this.s3 = new S3Client({
        region: this.configService.get('AWS_CDN_BUCKET_REGION'),
        endpoint: this.configService.get('AWS_CDN_BUCKET_URL'),
        forcePathStyle: true,
        credentials: {
          accessKeyId: this.configService.get('AWS_CDN_ACCESS_KEY') || '',
          secretAccessKey: this.configService.get('AWS_CDN_SECRET_KEY') || ''
        }
      })
    }
  }

  async uploadObject(
    file: Express.Multer.File,
    src: string
  ): Promise<{ src: string }> {
    try {
      const extension = this.getFileExtension(file.originalname)
      const keyWithoutExtenstion = `${src}/${this.generateUniqueImageName()}`
      const key = keyWithoutExtenstion + `${extension}`
      const fileType = this.extractContentType(file)

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.configService.get('AWS_CDN_BUCKET_NAME'),
          Key:
            this.configService.get('NODE_ENV') === 'production'
              ? keyWithoutExtenstion
              : key,
          Body: file.buffer,
          ContentType: fileType
        })
      )

      if (this.configService.get('NODE_ENV') === 'production') {
        return {
          src: keyWithoutExtenstion
        }
      } else {
        return {
          src: key
        }
      }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async deleteObject(src: string): Promise<{ result: string }> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('AWS_CDN_BUCKET_NAME'),
          Key: src
        })
      )

      return { result: 'ok' }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  /**
   * 랜덤한 uuid를 생성하여 리턴합니다.
   *
   * @returns {string}
   */
  private generateUniqueImageName(): string {
    const uniqueId = uuidv4()

    return uniqueId
  }

  /**
   * 파일이름으로 부터 MimeType을 추출하여 리턴합니다.
   * @param {Express.Multer.File} file - MimeType을 추출할 파일
   * @returns {string} 추출한 MimeType
   */
  private extractContentType(file: Express.Multer.File): string {
    if (file.mimetype) {
      return file.mimetype.toString()
    }

    return file.originalname
      ? mime.lookup(file.originalname) || 'application/octet-stream'
      : 'application/octet-stream'
  }

  /**
   * 파일에서 확장자를 추출합니다.
   *
   * @param {string} filename - 파일 원본명
   * @returns {string} 확장자
   * @throws {ParameterValidationException} 전달받은 파일에 확장자가 없는 경우 발생
   */
  private getFileExtension(filename: string): string {
    const match = filename.match(/\.[^.]+$/)

    if (match) {
      return match[0]
    }

    throw new ParameterValidationException('Unsupported file extension')
  }
}
