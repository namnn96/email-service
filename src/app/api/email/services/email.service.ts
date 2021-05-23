import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { ISendEmail, ISendEmailResponse } from '../models/send-email.model';
import { EmailQueue, SendEmailJob } from '../models/queue.model';

@Injectable()
export class EmailService {
  constructor(@InjectQueue(EmailQueue) private readonly emailQueue: Queue) {}

  async send(info: ISendEmail): Promise<ISendEmailResponse> {
    const job = await this.emailQueue.add(SendEmailJob, info);
    try {
      await job.finished();
      const updatedJob = await job.queue.getJob(job.id);
      return updatedJob.returnvalue;
    } catch (e) {
      throw e;
    } finally {
      job.remove(); // no need to wait for job to be removed from redis
    }
  }
}
