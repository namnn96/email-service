import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { ISendEmail, ISendEmailResponse } from '@app/api/email/models/send-email.model';
import { EmailQueue, SendEmailJob } from '@app/api/email/models/queue.model';

import { ProviderService } from './services/provider.service';

@Processor(EmailQueue)
export class EmailProcessor {
  private readonly _logger: Logger = new Logger(EmailProcessor.name);
  constructor(private providerSvc: ProviderService) {}

  @Process({ name: SendEmailJob, concurrency: 2 })
  async send(job: Job): Promise<ISendEmailResponse> {
    this._logger.debug(`[Job ${job.id}] Processing...`);
    const info: ISendEmail = job.data;
    const response = await this.providerSvc.send(job.id, info);
    this._logger.debug(`[Job ${job.id}] Done!`);
    return response;
  }
}
