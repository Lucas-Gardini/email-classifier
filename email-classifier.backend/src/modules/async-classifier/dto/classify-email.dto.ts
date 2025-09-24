import { IsOptional, IsString } from "class-validator";

export class ClassifyEmailDto {
  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  @IsOptional()
  sender: string;

  @IsString()
  body: string;
}
