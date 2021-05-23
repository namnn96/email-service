import { HttpModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { EmailQueue } from '@app/api/email/models/queue.model';

import { SendGridService } from './services/send-grid.service';
import { MailGunService } from './services/mail-gun.service';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: EmailQueue,
    })
  ],
  providers: [EmailProcessor, SendGridService, MailGunService],
})
export class EmailModule {}
