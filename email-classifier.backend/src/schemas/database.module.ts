import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Email, EmailSchema } from "./emails.schema";
import { EmailSuggestion, EmailSuggestionSchema } from "./email-suggestion.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Email.name, schema: EmailSchema },
      { name: EmailSuggestion.name, schema: EmailSuggestionSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class DatabaseModule {}
