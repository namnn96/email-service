import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { EmailController } from './email.controller';
import { EmailService } from './services/email.service';
import { SendEmailDto } from './dto/send-email.dto';
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
    it('should invoke EmailService.send with arg', async () => {
      const sendMailDto: SendEmailDto = new SendEmailDto();
      jest.spyOn(emailService, 'send').mockImplementation(() => Promise.resolve());
      await emailController.send(sendMailDto);
      expect(emailService.send).toHaveBeenCalledWith(sendMailDto)
    });
  });
});
