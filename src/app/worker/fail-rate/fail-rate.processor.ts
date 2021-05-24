import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { IFailRate } from '@app/api/fail-rate/models/fail-rate.model';
import { FailRateQueue, SetFailRateJob } from '@app/api/fail-rate/models/queue.model';

import { FailRateService } from './services/fail-rate.service';

@Processor(FailRateQueue)
export class FailRateProcessor {
  private readonly _logger: Logger = new Logger(FailRateProcessor.name);
  constructor(private failRateSvc: FailRateService) {}

  @Process({ name: SetFailRateJob })
  async set(job: Job): Promise<void> {
    this._logger.log(`[Job ${job.id}] Processing...`);
    const info: IFailRate = job.data;
    await this.failRateSvc.set(info);
    this._logger.log(`[Job ${job.id}] Done!`);
  }
}
