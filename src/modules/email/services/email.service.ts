import { Injectable } from '@nestjs/common';
import { ISendEmail } from '../models/send-email.model';

@Injectable()
export class EmailService {
  send(info: ISendEmail): Promise<void> {
    console.log(info);
    return;
  }
}
