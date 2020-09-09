import Service from '@services/index';
import * as nodemailer from 'nodemailer';
import { renderTemplate } from '@helpers/file';
import { HttpException } from '@error_handlers/errors';
import { UserModelInterface } from '@models/User';

class MailService extends Service {

  private transporter: nodemailer.Transporter;

  private templates: object = {
    'userConfirmation': 'mails/userConfirmation'
  };

  constructor() {
    super();
    const {
      MAIL_SERVICE,
      MAIL_ACCOUNT,
      MAIL_PASSWORD
    } = process.env;
    this.transporter = nodemailer.createTransport({
      service: MAIL_SERVICE,
      auth: {
        user: MAIL_ACCOUNT,
        pass: MAIL_PASSWORD
      }
    });
  }

  public async sendEmail(
    type: string,
    payload: object = {}
  ): Promise<any> {
    const template = this.templates[type];
    if (template && this.templates.hasOwnProperty(type)) {
      const mail = await renderTemplate(template, payload);
      console.log(mail);
    } else {
      throw new HttpException(500, 'Mail template not found');
    }
  }

  public async sendConfirmationEmail(user: UserModelInterface): Promise<any> {
    return this.sendEmail('userConfirmation', {
      first_name: user.first_name,
      last_name: user.last_name,
      confirmationToken: ''
    })
  }

}

export default new MailService();
