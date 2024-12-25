import nodemailer from 'nodemailer';
import { appLogger } from '../libs/logger';

class EmailHelper {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'live.smtp.mailtrap.io',
      port: 587,
      secure: false,
      auth: {
        user: '1a2b3c4d5e6f7g',
        pass: '1a2b3c4d5e6f7g',
      },
    });
  }

  private createMailOptions = (
    toEmail: string,
    subject: string,
    text: string
  ) => {
    const mailOptions = {
      from: 'shubhamrajjoshi69@gmail.com',
      to: toEmail,
      subject,
      text,
    };
  };

  public async sendEmail(toEmail: string, subject: string, text: string) {
    const mailOption = this.createMailOptions(toEmail, subject, text);

    const response = await this.transporter.sendMail(
      mailOption as unknown as nodemailer.SendMailOptions
    );

    appLogger.info(`Email Send to the ${toEmail.trim()}`, response);
  }
}

export default EmailHelper;
