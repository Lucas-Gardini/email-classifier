import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { EmailClassificationStatus } from "src/schemas/emails.schema";
import { ApiProperty } from "@nestjs/swagger";

export class EmailSearchDto {
  @ApiProperty({ required: false, description: "Filtro por assunto (contém)", example: "relatório" })
  @IsString()
  @IsOptional()
  subject: string;

  @ApiProperty({ required: false, description: "Filtro por remetente", example: "maria@empresa.com" })
  @IsString()
  @IsOptional()
  sender: string;

  @ApiProperty({ required: false, description: "Filtro por trecho do corpo", example: "seguem os dados" })
  @IsString()
  @IsOptional()
  body: string;

  @ApiProperty({ required: false, enum: EmailClassificationStatus, description: "Status de classificação" })
  @IsEnum(EmailClassificationStatus)
  @IsOptional()
  status: EmailClassificationStatus;

  @ApiProperty({ description: "Número da página (>=1)", example: 1, minimum: 1 })
  @Min(1)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number;

  @ApiProperty({ description: "Itens por página (1-100)", example: 20, minimum: 1, maximum: 100 })
  @Min(1)
  @Max(100)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;
}
