import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { ISendEmail } from '../models/send-email.model';
import { IEmail } from '../models/email.model';

interface ISendGridConfig {
  token: string;
  url: string;
}

@Injectable()
export class SendGridService {
  private readonly _config: ISendGridConfig;
  private readonly _sender: IEmail;

  constructor(
    private configSvc: ConfigService,
    private httpSvc: HttpService
  ) {
    this._config = this.configSvc.get<ISendGridConfig>('sendGrid');
    this._sender = this.configSvc.get<IEmail>('sender');
  }

  send(info: ISendEmail): Promise<HttpStatus> {
    const requestObj = this.prepareRequest(info);
    const headers = { Authorization: `Bearer ${this._config.token}` };
    return this.httpSvc.post<void>(this._config.url, requestObj, { headers })
      .pipe(
        map(response => response.status),
        catchError(err => {
          err.response.data.errors.forEach(e => console.log(e.message));
          return of(err.status);
        })
      )
      .toPromise();
  }

  private prepareRequest(info: ISendEmail): any {
    const { subject, body, toEmails, ccEmails, bccEmails } = info;
    return {
      personalizations: [
        {
          to: toEmails,
          ...((ccEmails || []).length > 0 ? { cc: ccEmails } : []),
          ...((bccEmails || []).length > 0 ? { bcc: bccEmails } : [])
        }
      ],
      from: this._sender,
      subject,
      content: [
        {
          type: 'text/plain',
          value: body
        }
      ]
    };
  }
}
