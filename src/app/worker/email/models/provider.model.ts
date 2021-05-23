import { ISendEmail, ISendEmailResponse } from '@app/api/email/models/send-email.model';

export enum EmailProviderName {
  SendGrid = 'SendGrid',
  MailGun = 'MailGun'
}

export interface IEmailProvider {
  readonly name: EmailProviderName;
  readonly send: (info: ISendEmail) => Promise<ISendEmailResponse>;
}
