export interface ISendEmail {
  toEmails: string[];
  ccEmails?: string[];
  bccEmails?: string[];
  subject: string;
  body: string;
}
