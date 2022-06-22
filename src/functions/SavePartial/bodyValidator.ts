import _ from "lodash"
import { bodyValidatorBuilder } from "../../common/bodyValidatorBuilder"
import { Partials } from "../../interfaces/Handlebars"
import { SavePartiaslRequest } from "../../interfaces/SaveEmailRequest"
import { ValidatorResponse } from "../../interfaces/ValidatorResponse"

const partialValidation = (values: string[]) => values.reduce((acc, val) => acc && _.isString(val), true)
const validatePartial = (values?: Partials) => values ? !partialValidation(Object.values(values)) : false

export const bodyValidator = (body: SavePartiaslRequest): ValidatorResponse => bodyValidatorBuilder(body)
  .addRule(e => _.isEmpty(e.partials), 'No partial provided')
  .addRule(e => validatePartial(e.partials), 'Partial provided is not a string')
  .validate()