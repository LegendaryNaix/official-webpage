import type {
  MailerOptions,
  MailerOptionsFactory
} from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { calculateSesSmtpPassword } from '@pepperize/cdk-ses-smtp-credentials'
import { join } from 'path'

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: this.config.get('NODEMAILER_HOST')
        ? {
            host: this.config.get('NODEMAILER_HOST'),
            auth: {
              user: this.config.get('NODEMAILER_USER'),
              pass: calculateSesSmtpPassword(
                this.config.get('NODEMAILER_PASS'),
                'ap-northeast-2'
              )
            }
          }
        : {
            SES: {
              ses: new SES({
                region: 'ap-northeast-2',
                credentials: defaultProvider()
              }),
              aws: { SendRawEmailCommand }
            }
          },
      defaults: {
        from: this.config.get('NODEMAILER_FROM')
      },
      template: {
        dir: join(__dirname, 'email/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }
  }
}
