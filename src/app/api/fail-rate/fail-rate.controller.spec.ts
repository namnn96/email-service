import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { FailRateController } from './fail-rate.controller';
import { FailRateService } from './services/fail-rate.service';
import { FailRateDto } from './dto/fail-rate.dto';
import { FailRateQueue } from './models/queue.model';

describe('FailRateController', () => {
  let failRateController: FailRateController;
  let failRateService: FailRateService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule, BullModule.registerQueue({
        name: FailRateQueue,
      })],
      controllers: [FailRateController],
      providers: [FailRateService],
    }).compile();

    failRateService = moduleRef.get<FailRateService>(FailRateService);
    failRateController = moduleRef.get<FailRateController>(FailRateController);
  });

  describe('set', () => {
    it('should return OK', async () => {
      const failRateDto: FailRateDto = new FailRateDto();
      const result: string = 'OK';
      jest.spyOn(failRateService, 'set').mockImplementation(() => Promise.resolve(result));

      expect(await failRateController.set(failRateDto)).toBe(result);
    });
  });
});
