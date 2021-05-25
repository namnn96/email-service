import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { IFailRate } from '@app/api/fail-rate/models/fail-rate.model';
import { FailRateQueue, GetFailRateJob, SetFailRateJob } from '@app/api/fail-rate/models/queue.model';

import { FailRateService } from './services/fail-rate.service';

@Processor(FailRateQueue)
export class FailRateProcessor {
  constructor(private failRateSvc: FailRateService) {}

  @Process({ name: SetFailRateJob })
  async set(job: Job): Promise<void> {
    const info: IFailRate = job.data;
    await this.failRateSvc.set(info);
  }

  @Process({ name: GetFailRateJob })
  get(): Promise<IFailRate> {
    return this.failRateSvc.get();
  }
}
