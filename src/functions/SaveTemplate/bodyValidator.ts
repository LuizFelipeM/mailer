import _ from "lodash"
import { bodyValidatorBuilder } from "../../common/bodyValidatorBuilder"
import { validateEmails } from "../../common/emailValidators"
import { SaveEmailRequest } from "../../interfaces/SaveEmailRequest"
import { ValidatorResponse } from "../../interfaces/ValidatorResponse"

export const bodyValidator = (body: SaveEmailRequest): ValidatorResponse => bodyValidatorBuilder(body)
  .addRule(e => !_.isString(e.template) || _.isEmpty(e.template), 'Template parameter not provided')
  .addRule(e => !_.isString(e.trigger) || _.isEmpty(e.trigger), 'Trigger parameter not provided')
  .addRule(e => validateEmails(e.emails), 'Invalid email in email list')
  .validate()