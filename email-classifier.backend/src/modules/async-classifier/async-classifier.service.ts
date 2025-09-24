import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EmailSuggestionDocument } from "src/schemas/email-suggestion.schema";
import { EmailClassification, EmailClassificationStatus, EmailDocument } from "src/schemas/emails.schema";
import { OpenaiService } from "../openai/openai.service";

@Injectable()
export class AsyncClassifierService {
  private readonly logger = new Logger(AsyncClassifierService.name);

  constructor(
    @InjectModel("Email") private emailModel: Model<EmailDocument>,
    @InjectModel("EmailSuggestion") private emailSuggestionModel: Model<EmailSuggestionDocument>,

    private readonly openaiService: OpenaiService,
  ) {}

  async classifyEmail(emailId: string): Promise<EmailClassificationStatus | "not-found"> {
    const email = await this.emailModel.findById(emailId);
    if (!email) {
      this.logger.warn(`Email with ID ${emailId} not found`);
      return "not-found";
    }

    await this.processEmail(email);
    return email.status;
  }

  private async processEmail(email: EmailDocument): Promise<void> {
    const { classification, summary } = await this.openaiService.summarizeEmail(email.subject, email.body);
    email.classification = classification ?? EmailClassification.UNCLASSIFIED;
    email.status = EmailClassificationStatus.CLASSIFIED;

    const { suggestedResponse } = await this.openaiService.suggestEmailResponse(
      email.subject,
      email.body,
      email.classification,
    );
    const savedSuggestion = await this.emailSuggestionModel.findOneAndUpdate(
      { email: email.id },
      {
        email: email._id,
        summary,
        suggestedResponse,
      },
      { upsert: true, new: true },
    );

    email.suggestion = savedSuggestion;

    await email.save();
    this.logger.log(`Email with ID ${email.id} classified as ${email.classification}`);
  }
}
