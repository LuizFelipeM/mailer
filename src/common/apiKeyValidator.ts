import _ from "lodash"
import { KeyValuePair } from "../interfaces/Generic"
import { ValidatorResponse } from "../interfaces/ValidatorResponse"

export const apiKeyValidator = (headers: KeyValuePair<string>): ValidatorResponse => {
  const errors: string[] = []
  
  if(!_.isString(headers['x-api-key'])) errors.push('No authentication header provided')
  if(_.isEmpty(headers['x-api-key'])) errors.push('Invalid authentication provided')

  return { isValid: !Boolean(errors.length), errors }
}