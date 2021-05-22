import { HttpModule, Module } from '@nestjs/common';

import { EmailController } from './email.controller';
import { EmailService } from './services/email.service';
import { SendGridService } from './services/send-grid.service';

@Module({
  imports: [HttpModule],
  controllers: [EmailController],
  providers: [EmailService, SendGridService],
})
export class EmailModule {}
