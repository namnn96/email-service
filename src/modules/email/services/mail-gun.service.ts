import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as FormData from 'form-data';

import { ISendEmail } from '../models/send-email.model';
import { IEmail } from '../models/email.model';

interface IMailGunConfig {
  apiKey: string;
  url: string;
}

@Injectable()
export class MailGunService {
  private readonly _config: IMailGunConfig;
  private readonly _sender: IEmail;

  constructor(
    private configSvc: ConfigService,
    private httpSvc: HttpService
  ) {
    this._config = this.configSvc.get<IMailGunConfig>('mailGun');
    this._sender = this.configSvc.get<IEmail>('sender');
  }

  send(info: ISendEmail): Promise<HttpStatus> {
    const formData = this.prepareFormData(info);
    const token = Buffer.from(`api:${this._config.apiKey}`).toString('base64');
    const headers = { ...formData.getHeaders(), Authorization: `Basic ${token}` };
    return this.httpSvc.post<void>(this._config.url, formData, { headers })
      .pipe(
        map(response => response.status),
        catchError(err => {
          console.log(err);
          return of(err.status);
        })
      )
      .toPromise();
  }

  private prepareFormData(info: ISendEmail): FormData {
    const { subject, body, toEmails, ccEmails, bccEmails } = info;
    const formData = new FormData();
    formData.append('from', this.prepareEmailFormValue(this._sender));
    formData.append('subject', subject);
    formData.append('text', body);
    toEmails.forEach(e => {
      formData.append('to', this.prepareEmailFormValue(e));
    });
    (ccEmails || []).forEach(e => {
      formData.append('cc', this.prepareEmailFormValue(e));
    });
    (bccEmails || []).forEach(e => {
      formData.append('bcc', this.prepareEmailFormValue(e));
    });

    return formData;
  }

  private prepareEmailFormValue(emailObj: IEmail): string {
    const { email, name } = emailObj;
    if (!name) {
      return email;
    }
    return `${name} <${email}>`;
  }
}
