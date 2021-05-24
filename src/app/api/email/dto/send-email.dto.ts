import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { EmailDto } from './email.dto';

export class SendEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly body: string;

  @ApiProperty({ type: () => [EmailDto] })
  @ArrayMinSize(1)
  @IsNotEmptyObject({ nullable: false }, { each: true })
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  readonly toEmails: EmailDto[];

  @ApiPropertyOptional({ type: () => [EmailDto] })
  @IsOptional()
  @IsNotEmptyObject({ nullable: false }, { each: true })
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  readonly ccEmails: EmailDto[];

  @ApiPropertyOptional({ type: () => [EmailDto] })
  @IsOptional()
  @IsNotEmptyObject({ nullable: false }, { each: true })
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  readonly bccEmails: EmailDto[];
}
