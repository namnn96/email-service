import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { ISendEmail, ISendEmailResponse } from '@app/api/email/models/send-email.model';
import { EmailQueue, SendEmailJob } from '@app/api/email/models/queue.model';

import { ProviderService } from './services/provider.service';

@Processor(EmailQueue)
export class EmailProcessor {
  constructor(private providerSvc: ProviderService) {}

  @Process({ name: SendEmailJob, concurrency: 2 })
  async send(job: Job): Promise<ISendEmailResponse> {
    console.log(`[Job ${job.id}] Processing...`);
    const info: ISendEmail = job.data;
    const response = await this.providerSvc.send(job.id, info);
    console.log(`[Job ${job.id}] Done!`);
    return response;
  }
}
