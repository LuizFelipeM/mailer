import { RenderEmailBaseRequest } from "./RenderEmailBaseRequest";
import { SendEmailBaseRequest } from "./SendEmailBaseRequest";

export type ApiSendEmailRequest = Omit<SendEmailBaseRequest, 'htmlBody' | 'textBody' | 'source'> & RenderEmailBaseRequest