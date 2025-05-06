import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: this.configService.get('EMAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string) {
    const confirmationUrl = `${this.configService.get('FRONTEND_URL')}/confirm-email?token=${token}`;
    
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Please confirm your email',
      html: `
        <h3>Welcome to Stock Dashboard!</h3>
        <p>Please confirm your email by clicking the link below:</p>
        <p>
          <a href="${confirmationUrl}">Confirm Email</a>
        </p>
        <p>If you did not request this email, please ignore it.</p>
      `,
    });
  }
}
