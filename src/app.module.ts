import { Module } from '@nestjs/common';

import { CoreModule } from '@app/core/core.module';
import { EmailModule } from '@app/modules/email/email.module';

@Module({
  imports: [CoreModule, EmailModule],
})
export class AppModule {}
