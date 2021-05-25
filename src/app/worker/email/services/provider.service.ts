import { CACHE_MANAGER, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JobId } from 'bull';
import { Cache } from 'cache-manager';

import { base64Encode } from '@shared/utils';
import { ISendEmail, ISendEmailResponse } from '@app/api/email/models/send-email.model';
import { FailRateService } from '@app/worker/fail-rate/services/fail-rate.service';

import { EmailProviderName, IEmailProvider } from '../models/provider.model';
import { SendGridService } from './send-grid.service';
import { MailGunService } from './mail-gun.service';

const DefaultProviderQueue = [EmailProviderName.SendGrid, EmailProviderName.MailGun];

@Injectable()
export class ProviderService {
  private readonly _logger: Logger = new Logger(ProviderService.name);
  private _providerBucket: { [key: string]: IEmailProvider } = {};
  private _providerFailRateMap: { [key: string]: string } = {};

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private sendGridSvc: SendGridService,
    private mailGunSvc: MailGunService,
    private failRateSvc: FailRateService
  ) {
    this.registerProviders();
  }

  private registerProviders(): void {
    this._providerBucket = {
      [EmailProviderName.MailGun]: this.mailGunSvc,
      [EmailProviderName.SendGrid]: this.sendGridSvc
    };
    this._providerFailRateMap = {
      [EmailProviderName.MailGun]: 'mailGun',
      [EmailProviderName.SendGrid]: 'sendGrid'
    };
  }

  async send(jobId: JobId, info: ISendEmail): Promise<ISendEmailResponse> {
    const providers = await this.getProviders();
    const failRates = await this.failRateSvc.get();

    let emailSent: boolean = false;
    let idx: number = 0;
    let response: ISendEmailResponse;
    while (!emailSent && idx < providers.length) {
      const emailProvider = this._providerBucket[providers[0]];
      const failRate = failRates[this._providerFailRateMap[providers[0]]];

      if (failRate > Math.random()) { // force provider to appear as fail
        response = { status: HttpStatus.BAD_GATEWAY, message: 'Bad gateway due to fail rate' };
      } else { // ...otherwise let it flow to make a http call to the provider
        response = await emailProvider.send(info);
      }

      if (response.status < 400) { // email sent successfully
        this._logger.log(`[Job ${jobId}] Provider "${emailProvider.name}" succeeded`);
        emailSent = true;
      } else { // emailProvider failed to send
        this._logger.log(`[Job ${jobId}] Provider "${emailProvider.name}" failed - ${base64Encode(JSON.stringify(info))}`);
        providers.push(providers.shift()); // move on to the next provider in list
        idx++;
      }
    }

    // Return status and message as is if succeeds
    if (emailSent) {
      // Update provider queue in cache to inform future jobs about which provider to try first
      if (idx > 0) {
        this.setProviders(providers);
      }
      return response;
    }

    // Otherwise throw a general error as we have tried all possible providers
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error'
    };
  }

  private async setProviders(providers: EmailProviderName[]): Promise<void> {
    try {
      await this.cacheManager.set('providers', providers);
    } catch (e) {
      this._logger.error(e);
    }
  }

  private async getProviders(): Promise<EmailProviderName[]> {
    try {
      const providers = await this.cacheManager.get<EmailProviderName[]>('providers');
      if ((providers || []).length === 0) {
        await this.setProviders(DefaultProviderQueue);
        return DefaultProviderQueue;
      }
      return providers;
    } catch (e) {
      this._logger.error(e);
      return DefaultProviderQueue;
    }
  }
}
