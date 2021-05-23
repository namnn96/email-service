import { HttpStatus } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { base64Encode } from '@shared/utils';
import { ISendEmail, ISendEmailResponse } from '@app/api/email/models/send-email.model';
import { EmailQueue, SendEmailJob } from '@app/api/email/models/queue.model';

import { SendGridService } from './services/send-grid.service';
import { MailGunService } from './services/mail-gun.service';

@Processor(EmailQueue)
export class EmailProcessor {
  constructor(
    private sendGridSvc: SendGridService,
    private mailGunSvc: MailGunService
  ) {}

  @Process(SendEmailJob)
  async send(job: Job): Promise<ISendEmailResponse> {
    const info: ISendEmail = job.data;
    // const response = await this.sendGridSvc.send(info);
    const response = await this.mailGunSvc.send(info);

    // Return status and message as is if succeeds
    if (response.status < 400) {
      return response;
    }

    // Otherwise log and throw a general error
    console.log(`[JOB ${job.id}]`, base64Encode(JSON.stringify(job.data)), base64Encode(JSON.stringify(response)));
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error'
    };
  }
}
