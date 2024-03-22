import { MailerService } from '@nestjs-modules/mailer'
import { Service } from '@libs/decorator'

@Service()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailAuthenticationPin(email: string, pin: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: '[SKKU ROYALS] 이메일 인증',
      template: 'email-auth',
      context: { pin }
    })
  }
}
