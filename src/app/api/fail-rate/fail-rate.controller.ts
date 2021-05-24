import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FailRateDto } from './dto/fail-rate.dto';
import { FailRateService } from './services/fail-rate.service';

@ApiTags('fail-rate')
@Controller('api/v1/fail-rate')
export class FailRateController {
  constructor(private readonly failRateSvc: FailRateService) {}

  @Post()
  set(@Body() failRateDto: FailRateDto) {
    return this.failRateSvc.set(failRateDto);
  }
}
