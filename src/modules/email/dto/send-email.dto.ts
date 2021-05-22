import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly body: string;

  @ApiProperty()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  @IsNotEmpty({ each: true })
  readonly toEmails: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail(null, { each: true })
  readonly ccEmails: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail(null, { each: true })
  readonly bccEmails: string[];
}
