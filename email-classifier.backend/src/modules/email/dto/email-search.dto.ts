import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";
import { EmailClassificationStatus } from "src/schemas/emails.schema";

export class EmailSearchDto {
  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  @IsOptional()
  sender: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsEnum(EmailClassificationStatus)
  @IsOptional()
  status: EmailClassificationStatus;

  @Min(1)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number;

  @Min(1)
  @Max(100)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;
}
