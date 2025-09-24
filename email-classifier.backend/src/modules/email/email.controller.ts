import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { ClassifyEmailDto } from '../async-classifier/dto/classify-email.dto';
import { EmailSearchDto } from './dto/email-search.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('list')
  async getEmails(@Query() params: Record<string, any>) {
    const dto = plainToInstance(EmailSearchDto, params);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return { error: 'Validation failed', details: errors };
    }
    return this.emailService.getEmails(dto);
  }

  @Post('classify')
  async classifyEmail(@Body() classifyEmailDto: ClassifyEmailDto) {
    return this.emailService.classifyEmail(classifyEmailDto);
  }

  @Post('classify/bulk')
  async classifyEmailBulk(@Body() classifyEmailDtos: ClassifyEmailDto[]) {
    const processingStatus = {
      processedIndexes: [] as number[],
      failedIndexes: [] as number[],
    };

    for (let i = 0; i < classifyEmailDtos.length; i++) {
      try {
        const result = await this.emailService.classifyEmail(
          classifyEmailDtos[i],
        );
        if (result.success) {
          processingStatus.processedIndexes.push(i);
        } else {
          processingStatus.failedIndexes.push(i);
        }
      } catch (error) {
        processingStatus.failedIndexes.push(i);
      }
    }

    return processingStatus;
  }
}
