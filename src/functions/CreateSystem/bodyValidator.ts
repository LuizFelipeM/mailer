import _ from "lodash";
import { bodyValidatorBuilder } from "../../common/bodyValidatorBuilder";
import { emailValidation } from "../../common/emailValidators";
import { CreateSystemRequest } from "../../interfaces/CreateSystemRequest";
import { ValidatorResponse } from "../../interfaces/ValidatorResponse";

export const bodyValidator = (body: CreateSystemRequest): ValidatorResponse => bodyValidatorBuilder(body)
  .addRule(e => _.isEmpty(e.email), 'Email not provided')
  .addRule(e => !emailValidation(e.email), 'Invalid email')
  .validate()