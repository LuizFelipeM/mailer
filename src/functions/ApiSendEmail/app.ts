import _ from 'lodash'
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { bodyValidator } from './bodyValidator'
import { api } from '../../common/apiBuilders'
import { apiKeyValidator as headerValidator } from '../../common/apiKeyValidator'
import { ApiSendEmailRequest } from '../../interfaces/ApiSendEmailRequest'
import { tbSystems } from '../../common/tables'
import { sendEmail } from './sendEmail'
import { renderEmail } from './renderEmail'

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const response = api.resultBuilder

  try {
    const request = api.requestBuilder<ApiSendEmailRequest>(event, { bodyValidator, headerValidator })

    const { 'x-api-key': system } = request.headers

    const { Items } = await tbSystems.query({
      KeyConditionExpression: "#system = :system",
      ExpressionAttributeNames: { '#system': 'id' },
      ExpressionAttributeValues: { ':system': system }
    })

    if(_.isUndefined(Items))
      return response.status(401).result

    // AWS Lambda Callback configuration
    const htmls = await renderEmail(system, request.body)

    // AWS Lambda Callback configuration
    const statusCode = await sendEmail(Items[0].source, request.body, htmls)

    response.status(statusCode)
  } catch (error) {
    console.error(error)
    response.status(error?.statusCode ?? 500).json({ error: error?.message })
  }

  return response.result
}

