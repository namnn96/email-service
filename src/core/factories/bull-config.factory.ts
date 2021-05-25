import { ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bull';

export function bullConfigFactory(configService: ConfigService): QueueOptions {
  return {
    redis: {
      host: configService.get('redis.host'),
      port: +configService.get('redis.port'),
      db: +configService.get('redis.db'),
      keyPrefix: configService.get('redis.prefix'),
    },
    defaultJobOptions: {
      removeOnComplete: true
    }
  }
}
