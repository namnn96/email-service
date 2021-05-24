import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { base64Encode } from '@shared/utils';

import { IFailRate } from '../models/fail-rate.model';
import { FailRateQueue, SetFailRateJob } from '../models/queue.model';

@Injectable()
export class FailRateService {
  private readonly _logger: Logger = new Logger(FailRateService.name);
  constructor(@InjectQueue(FailRateQueue) private readonly failRateQueue: Queue) {}

  async set(info: IFailRate): Promise<string> {
    const job = await this.failRateQueue.add(SetFailRateJob, info);
    this._logger.log(`[Job ${job.id}] Queued - ${base64Encode(JSON.stringify(info))}`);
    try {
      await job.finished();
      return 'OK';
    } catch (e) {
      throw e;
    } finally {
      job.remove(); // no need to wait for job to be removed from redis
    }
  }
}
