import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { cacheConfigFactory } from '@core/factories/cache-config.factory';
import { FailRateQueue } from '@app/api/fail-rate/models/queue.model';

import { FailRateService } from './services/fail-rate.service';
import { FailRateProcessor } from './fail-rate.processor';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: FailRateQueue,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: cacheConfigFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [FailRateProcessor, FailRateService],
})
export class FailRateModule {}
