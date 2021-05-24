import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import config from '@core/config';
import { bullConfigFactory } from '@core/factories/bull-config.factory';
import { CoreModule } from '@core/core.module';
import { EmailModule } from '@app/api/email/email.module';
import { FailRateModule } from '@app/api/fail-rate/fail-rate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: bullConfigFactory,
      inject: [ConfigService],
    }),
    CoreModule,
    EmailModule,
    FailRateModule
  ],
})
export class ApiModule {}
