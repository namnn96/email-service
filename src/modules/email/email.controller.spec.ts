import { Test } from '@nestjs/testing';

import { EmailController } from './email.controller';
import { EmailService } from './services/email.service';

describe('EmailController', () => {
  let emailController: EmailController;
  let emailService: EmailService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [EmailService],
    }).compile();

    emailService = moduleRef.get<EmailService>(EmailService);
    emailController = moduleRef.get<EmailController>(EmailController);
  });
});
