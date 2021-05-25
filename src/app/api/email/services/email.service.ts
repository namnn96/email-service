import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { ISendEmail } from '../models/send-email.model';
import { EmailQueue, SendEmailJob } from '../models/queue.model';

@Injectable()
export class EmailService {
  private readonly _logger: Logger = new Logger(EmailService.name);
  constructor(@InjectQueue(EmailQueue) private readonly emailQueue: Queue) {}

  async send(info: ISendEmail): Promise<void> {
    try {
      const job = await this.emailQueue.add(SendEmailJob, info);
      this._logger.debug(`[Job ${job.id}] Queued`);
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }
}
