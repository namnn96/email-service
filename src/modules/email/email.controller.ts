import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './services/email.service';

@ApiTags('email')
@Controller('api/v1/email')
export class EmailController {
  constructor(private readonly _emailSvc: EmailService) {}

  @Post('send')
  async send(@Body() sendEmailDto: SendEmailDto) {
    await this._emailSvc.send(sendEmailDto);
  }
}
