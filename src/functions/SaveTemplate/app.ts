import _ from 'lodash'
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { bodyValidator } from './bodyValidator'
import { api } from '../../common/apiBuilders'
import { SaveEmailRequest } from '../../interfaces/SaveEmailRequest'
import { tbTemplates } from '../../common/tables'
import { apiKeyValidator as headerValidator } from '../../common/apiKeyValidator'

export const handler: APIGatewayProxyHandlerV2 = async event => {
  const response = api.resultBuilder

  try {
    const request = api.requestBuilder<SaveEmailRequest>(event, { bodyValidator, headerValidator })

    const { 'x-api-key': system } = request.headers
    const { template, emails, trigger } = request.body
  
    const id = await tbTemplates.saveItem({ system, template, emails, trigger })

    response.json({ id })
  } catch(error) {
    console.error(error)
    response.status(error?.statusCode ?? 500).json({ error: error?.message })
  }
  
  return response.result
}

