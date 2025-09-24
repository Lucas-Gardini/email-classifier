import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ClassifyEmailDto {
  @ApiProperty({ description: "Assunto do email", required: false, example: "Reunião de status" })
  @IsString()
  @IsOptional()
  subject: string;

  @ApiProperty({ description: "Remetente do email", required: false, example: "joao@empresa.com" })
  @IsString()
  @IsOptional()
  sender: string;

  @ApiProperty({ description: "Corpo do email (texto)", example: "Olá, segue em anexo..." })
  @IsString()
  body: string;
}
