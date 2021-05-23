import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import config from '@core/config';
import { bullConfigFactory } from '@core/services/bull-config.service';
import { CoreModule } from '@core/core.module';
import { EmailModule } from '@app/worker/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: bullConfigFactory,
      inject: [ConfigService],
    }),
    CoreModule,
    EmailModule
  ],
})
export class WorkerModule {}
