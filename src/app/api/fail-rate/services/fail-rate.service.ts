import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { IFailRate } from '../models/fail-rate.model';
import { FailRateQueue, GetFailRateJob, SetFailRateJob } from '../models/queue.model';

@Injectable()
export class FailRateService {
  private readonly _logger: Logger = new Logger(FailRateService.name);
  constructor(@InjectQueue(FailRateQueue) private readonly failRateQueue: Queue) {}

  async set(info: IFailRate): Promise<void> {
    try {
      await this.failRateQueue.add(SetFailRateJob, info);
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  async get(): Promise<IFailRate> {
    try {
      const job = await this.failRateQueue.add(GetFailRateJob, null, {});
      await job.finished();
      const updatedJob = await job.queue.getJob(job.id);
      return updatedJob.returnvalue;
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }
}
