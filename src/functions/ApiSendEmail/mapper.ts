import { ApiSendEmailRequest } from "../../interfaces/ApiSendEmailRequest";
import { RenderEmailBaseRequest } from "../../interfaces/RenderEmailBaseRequest";
import { SendEmailBaseRequest } from "../../interfaces/SendEmailBaseRequest";

export const mapRender = ({ data, trigger }: ApiSendEmailRequest): RenderEmailBaseRequest => ({ data, trigger })

export const mapSendEmail = (source: string, { subject, reply, bcc, cc, to }: ApiSendEmailRequest): SendEmailBaseRequest => ({ source, subject, reply, bcc, cc, to })