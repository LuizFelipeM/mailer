import _ from "lodash"
import { bodyValidatorBuilder } from "../../common/bodyValidatorBuilder"
import { RenderEmailBaseRequest } from "../../interfaces/RenderEmailBaseRequest"
import { ValidatorResponse } from "../../interfaces/ValidatorResponse"

export const bodyValidator = (body: RenderEmailBaseRequest): ValidatorResponse =>  bodyValidatorBuilder(body)
  .addRule(e => _.isEmpty(e.trigger), 'Trigger not provided')
  .validate()