import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

export function cacheConfigFactory(configService: ConfigService): CacheModuleOptions {
  return {
    store: redisStore,
    host: configService.get('redis.host'),
    port: +configService.get('redis.port'),
    db: +configService.get('redis.db'),
    keyPrefix: configService.get('redis.prefix') + ':',
    ttl: 60 * 60 * 24 // one day
  }
}
