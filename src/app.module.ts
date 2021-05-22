import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from '@app/config';
import { CoreModule } from '@app/core/core.module';
import { EmailModule } from '@app/modules/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    CoreModule,
    EmailModule
  ],
})
export class AppModule {}
