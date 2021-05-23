import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { cacheConfigFactory } from '@core/factories/cache-config.factory';
import { EmailQueue } from '@app/api/email/models/queue.model';

import { SendGridService } from './services/send-grid.service';
import { MailGunService } from './services/mail-gun.service';
import { ProviderService } from './services/provider.service';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: EmailQueue,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: cacheConfigFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [EmailProcessor, ProviderService, SendGridService, MailGunService],
})
export class EmailModule {}
