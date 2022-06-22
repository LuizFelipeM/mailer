import _ from 'lodash'
import { SQSHandler } from 'aws-lambda'
import { bodyValidator } from './bodyValidator'
import { SendEmailRequest } from '../../interfaces/SendEmailRequest'
import { SendEmail } from '../../common/lambdaInvocation'

export const handler: SQSHandler = async event => {
  try {
    event.Records.forEach(async ({ body }) => {
      const sendEmailRequest: SendEmailRequest = JSON.parse(body)
      const { isValid, errors } = bodyValidator(sendEmailRequest)
  
      if(!isValid)
        throw new Error(`Errors encountered on request: ${errors.join(', ')}`)
  
      // AWS Lambda callback call
      console.log('SendEmail lambda invocation start')
      const res = await SendEmail(sendEmailRequest)
      console.log('SendEmail lambda invocation end - res', res)
    })
  } catch (error) {
    // AWS Queue callback call
    console.error(error)
  }
}

