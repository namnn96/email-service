import { HttpModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { EmailController } from './email.controller';
import { EmailService } from './services/email.service';
import { EmailQueue } from './models/queue.model';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: EmailQueue,
    })
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
