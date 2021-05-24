import { ApiProperty, } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class FailRateDto {
  @ApiProperty({
    description: 'Force SendGrid provider to fail at rate',
    minimum: 0,
    maximum: 1
  })
  @IsNumber()
  @Max(1)
  @Min(0)
  @IsNotEmpty()
  readonly sendGrid: number;

  @ApiProperty({
    description: 'Force MailGun provider to fail at rate',
    minimum: 0,
    maximum: 1
  })
  @IsNumber()
  @Max(1)
  @Min(0)
  @IsNotEmpty()
  readonly mailGun: number;
}
