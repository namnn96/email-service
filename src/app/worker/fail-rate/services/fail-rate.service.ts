import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { IFailRate } from '@app/api/fail-rate/models/fail-rate.model';

const DefaultFailRate: IFailRate = { mailGun: 0, sendGrid: 0 };

@Injectable()
export class FailRateService {
  private readonly _logger: Logger = new Logger(FailRateService.name);
  private readonly _cacheKey: string = 'fail-rate';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(info: IFailRate): Promise<void> {
    try {
      await this.cacheManager.set(this._cacheKey, info, { ttl: 0 }); // persist fail-rate without ttl
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  async get(): Promise<IFailRate> {
    try {
      const failRate = await this.cacheManager.get<IFailRate>(this._cacheKey);
      if (!failRate) {
        this.set(DefaultFailRate); // side effect - no need to wait
        return DefaultFailRate;
      }
      return failRate;
    } catch (e) {
      this._logger.error(e);
      return DefaultFailRate;
    }
  }
}
