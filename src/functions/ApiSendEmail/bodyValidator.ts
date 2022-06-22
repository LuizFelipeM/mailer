import _ from "lodash"
import { bodyValidatorBuilder } from "../../common/bodyValidatorBuilder"
import { validateEmails } from "../../common/emailValidators"
import { ApiSendEmailRequest } from "../../interfaces/ApiSendEmailRequest"
import { ValidatorResponse } from "../../interfaces/ValidatorResponse"

export const bodyValidator = (body: ApiSendEmailRequest): ValidatorResponse => bodyValidatorBuilder(body)
  .addRule(e => !_.isString(e.subject), 'Subject parameter not provided')
  .addRule(e => !_.isArray(e.to), 'To parameter not provided')
  .addRule(e => validateEmails(e.bcc), 'Invalid email in BCC email list')
  .addRule(e => validateEmails(e.cc), 'Invalid email in CC email list')
  .addRule(e => validateEmails(e.to), 'Invalid email in To email list')
  .addRule(e => validateEmails(e.reply), 'Invalid email in Reply email list')
  .validate()