import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Email } from "./emails.schema";

export type EmailSuggestionDocument = HydratedDocument<EmailSuggestion>;

@Schema({ timestamps: true })
export class EmailSuggestion {
  @Prop({ type: Types.ObjectId, ref: "Email", required: true, index: true })
  email: Types.ObjectId | Email;

  @Prop()
  summary: string;

  @Prop({ required: true })
  suggestedResponse: string;
}

export const EmailSuggestionSchema = SchemaFactory.createForClass(EmailSuggestion);
