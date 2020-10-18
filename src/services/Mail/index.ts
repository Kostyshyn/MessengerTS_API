import Service, { Dictionary } from '@services/index';
import * as nodemailer from 'nodemailer';
import { renderTemplate } from '@helpers/file';
import { HttpException } from '@error_handlers/errors';
import { UserModelInterface } from '@models/User';
import TokenService from '@services/Token/index';

export interface MailOptionsInterface {
  to: string;
  subject: string;
  html?: string;
}

export interface FullMailOptionsInterface extends MailOptionsInterface{
  from: string;
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
    'info': 'mails/info',
    'userConfirmation': 'mails/userConfirmation',
    'resetPassword': 'mails/resetPassword'
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
      // TODO: mail account can be different
      const { MAIL_ACCOUNT } = process.env;
      const mail: FullMailOptionsInterface = {
        from: MAIL_ACCOUNT,
        ...options,
        html
      };
      return this.transporter.sendMail(mail);
    } else {
      throw new HttpException(500, 'Mail template not found');
    }
  }

  public async sendConfirmationEmail(
    user: UserModelInterface,
    origin: string
  ): Promise<SentMessageInfo> {
    const { email, _id } = user;
    const confirmationToken = await TokenService.createToken(_id, 'confirm');
    const link = `${origin}/confirm?token=${confirmationToken}`;
    return this.sendEmail('userConfirmation', {
      first_name: user.first_name,
      last_name: user.last_name,
      link
    }, {
      to: email,
      subject: 'Confirmation'
    });
  }

  public async sendResetPasswordEmail(
    user: UserModelInterface,
    origin: string
  ): Promise<SentMessageInfo> {
    const { email, _id } = user;
    const resetToken = await TokenService.createToken(_id, 'reset');
    const link = `${origin}/change-password?token=${resetToken}`;
    return this.sendEmail('resetPassword', {
      first_name: user.first_name,
      last_name: user.last_name,
      link
    }, {
      to: email,
      subject: 'Reset password'
    });
  }

  public async sendInfoEmail(
    user: UserModelInterface,
    title: string,
    message: string,
    subject: string
  ): Promise<SentMessageInfo> {
    const { email } = user;
    // TODO: make it more reusable and flexible
    return this.sendEmail('info', {
      title,
      message,
      first_name: user.first_name,
      last_name: user.last_name,
    }, {
      to: email,
      subject
    });
  }

}

export default new MailService();
