import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './services/email.service';

@ApiTags('email')
@Controller('api/v1/email')
export class EmailController {
  constructor(private readonly emailSvc: EmailService) {}

  @Post('send')
  send(@Body() sendEmailDto: SendEmailDto) {
    return this.emailSvc.send(sendEmailDto);
  }
}
