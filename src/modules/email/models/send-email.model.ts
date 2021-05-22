export interface ISendEmail {
  toEmails: string[];
  ccEmails?: string[];
  bccEmails?: string[];
  title: string;
  body: string;
}
