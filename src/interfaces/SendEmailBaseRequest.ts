export interface SendEmailBaseRequest {
  source: string
  subject: string
  htmlBody?: string
  textBody?: string
  bcc?: string[]
  cc?: string[]
  to?: string[]
  reply?: string[]
}