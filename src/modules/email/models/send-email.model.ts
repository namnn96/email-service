import { IEmail } from './email.model';

export interface ISendEmail {
  toEmails: IEmail[];
  ccEmails?: IEmail[];
  bccEmails?: IEmail[];
  subject: string;
  body: string;
}
