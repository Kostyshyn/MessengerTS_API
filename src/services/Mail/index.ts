import Service from '@services/index';
// import { HttpException, ValidationError } from '@error_handlers/errors';
import * as nodemailer from 'nodemailer';

class MailService extends Service {

  private transporter: nodemailer.Transporter;

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

}

export default new MailService();
