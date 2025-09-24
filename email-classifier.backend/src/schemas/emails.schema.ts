import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { EmailSuggestion } from "./email-suggestion.schema";

export enum EmailClassificationStatus {
  PENDING = "pending",
  CLASSIFIED = "classified",
  ERROR = "error",
}

export enum EmailClassification {
  PRODUCTIVE = "productive",
  UNPRODUCTIVE = "unproductive",
  UNCLASSIFIED = "unclassified",
}

export type EmailDocument = HydratedDocument<Email>;

@Schema({ timestamps: true })
export class Email {
  @Prop({ index: true })
  subject: string;

  @Prop({ index: true })
  sender: string;

  @Prop()
  body: string;

  @Prop({
    index: true,
    enum: EmailClassificationStatus,
    default: EmailClassificationStatus.PENDING,
  })
  status: EmailClassificationStatus;

  @Prop({
    index: true,
    enum: EmailClassification,
    default: EmailClassification.UNCLASSIFIED,
  })
  classification: EmailClassification;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "EmailSuggestion" })
  suggestion?: EmailSuggestion;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
