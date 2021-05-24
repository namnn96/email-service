import { HttpModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { FailRateController } from './fail-rate.controller';
import { FailRateService } from './services/fail-rate.service';
import { FailRateQueue } from './models/queue.model';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: FailRateQueue,
    })
  ],
  controllers: [FailRateController],
  providers: [FailRateService],
})
export class FailRateModule {}
