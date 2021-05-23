import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { ISendEmail, ISendEmailResponse } from '@app/api/email/models/send-email.model';
import { IEmail } from '@app/api/email/models/email.model';

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

  send(info: ISendEmail): Promise<ISendEmailResponse> {
    const bodyJSON = this.prepareBodyJSON(info);
    const headers = { Authorization: `Bearer ${this._config.token}` };
    return this.httpSvc.post<void>(this._config.url, bodyJSON, { headers })
      .pipe(
        map(response => ({ status: response.status })),
        catchError(err => {
          const message = err.response.data.errors.forEach(e => e.message).join('\n');
          return of({ status: err.status, message });
        })
      )
      .toPromise();
  }

  private prepareBodyJSON(info: ISendEmail): any {
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
