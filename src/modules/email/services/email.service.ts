import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ISendEmail } from '../models/send-email.model';
import { SendGridService } from './send-grid.service';

@Injectable()
export class EmailService {
  constructor(private sendGridSvc: SendGridService) {}

  async send(info: ISendEmail): Promise<void> {
    console.log(info);
    const statusCode = await this.sendGridSvc.send(info);
    if (statusCode < 400) {
      return;
    }

    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
