import _ from "lodash"
import { SendEmail } from "../../common/lambdaInvocation"
import { ApiSendEmailRequest } from "../../interfaces/ApiSendEmailRequest"
import { mapSendEmail } from "./mapper"

export const sendEmail = async (source: string, request: ApiSendEmailRequest, htmls: string[]) => {
  console.log('SendEmail async invocation start')
  
  const sendEmailRequest = mapSendEmail(source, request)
  const res = await Promise.all(htmls?.map(async htmlBody => await SendEmail({ ...sendEmailRequest, htmlBody })))
  
  console.log('SendEmail async invocation end - res', res)

  return res.reduce((status, { StatusCode }) => Math.max(status, _.toNumber(StatusCode)), Number.NEGATIVE_INFINITY)
}