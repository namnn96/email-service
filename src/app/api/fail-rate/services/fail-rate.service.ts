import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { IFailRate } from '../models/fail-rate.model';
import { FailRateQueue, SetFailRateJob } from '../models/queue.model';

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
}
