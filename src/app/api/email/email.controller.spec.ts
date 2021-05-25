import { Test } from '@nestjs/testing';
import { HttpModule, HttpStatus } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { EmailController } from './email.controller';
import { EmailService } from './services/email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ISendEmailResponse } from './models/send-email.model';
import { EmailQueue } from './models/queue.model';

describe('EmailController', () => {
  let emailController: EmailController;
  let emailService: EmailService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule, BullModule.registerQueue({
        name: EmailQueue,
      })],
      controllers: [EmailController],
      providers: [EmailService],
    }).compile();

    emailService = moduleRef.get<EmailService>(EmailService);
    emailController = moduleRef.get<EmailController>(EmailController);
  });

  describe('send', () => {
    it('should return a send-mail response', async () => {
      const sendMailDto: SendEmailDto = new SendEmailDto();
      const result: ISendEmailResponse = { status: HttpStatus.OK };
      jest.spyOn(emailService, 'send').mockImplementation(() => Promise.resolve(result));

      expect(await emailController.send(sendMailDto)).toBe(result);
    });
  });
});
