import Service from '@services/index';
import * as nodemailer from 'nodemailer';
import { renderTemplate } from '@helpers/file';
import { HttpException } from '@error_handlers/errors';
import { UserModelInterface } from '@models/User';

export interface Dictionary<T> {
  [key: string]: T;
}

export interface MailOptionsInterface {
  from: string;
  to: string;
  subject: string;
  html?: string;
}

export interface Envelope {
  from: string | false;
  to: string[];
}

export interface SentMessageInfo {
  envelope: Envelope;
  messageId: string;
  response: string;
}

export interface Mailer {
  getTemplates(): Dictionary<string>;

  init(): Promise<true>;

  sendEmail(
    type: string,
    payload: object,
    options: MailOptionsInterface
  ): Promise<SentMessageInfo>;
}

class MailService extends Service implements Mailer {

  private transporter: nodemailer.Transporter;

  private templates: Dictionary<string> = {
    'userConfirmation': 'mails/userConfirmation'
  };

  constructor() {
    super();
  }

  public getTemplates(): Dictionary<string> {
    return this.templates;
  }

  public async init(): Promise<true> {
    const {
      MAIL_SERVICE,
      MAIL_ACCOUNT,
      MAIL_PASSWORD,
      NODE_ENV
    } = process.env;
    this.transporter = nodemailer.createTransport({
      service: MAIL_SERVICE,
      auth: {
        user: MAIL_ACCOUNT,
        pass: MAIL_PASSWORD
      },
      logger: NODE_ENV === 'development'
    });
    return this.transporter.verify();
  }

  public async sendEmail(
    type: string,
    payload: object = {},
    options: MailOptionsInterface
  ): Promise<SentMessageInfo> {
    const template = this.templates[type];
    if (template && this.templates.hasOwnProperty(type)) {
      const html = await renderTemplate(template, payload);
      const mail: MailOptionsInterface = {
        ...options,
        html
      };
      return this.transporter.sendMail(mail);
    } else {
      throw new HttpException(500, 'Mail template not found');
    }
  }

  public async sendConfirmationEmail(user: UserModelInterface): Promise<SentMessageInfo> {
    const { email } = user;
    // TODO: mail account can be different
    const { MAIL_ACCOUNT } = process.env;
    return this.sendEmail('userConfirmation', {
      first_name: user.first_name,
      last_name: user.last_name,
      confirmationToken: ''
    }, {
      from: MAIL_ACCOUNT,
      to: email,
      subject: 'Confirmation'
    });
  }

}

export default new MailService();
