import _ from "lodash"
import { compile } from "handlebars"
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { RenderEmailBaseRequest } from "../../interfaces/RenderEmailBaseRequest"
import { api } from "../../common/apiBuilders"
import { apiKeyValidator as headerValidator } from "../../common/apiKeyValidator"
import { bodyValidator } from "./bodyValidator"
import { Render } from "../../common/lambdaInvocation"

interface Partial {
  id: string
  system: string
  name: string
  template: string
}

export const handler: APIGatewayProxyHandlerV2 = async event => {
  const response = api.resultBuilder

  try {
    const request = api.requestBuilder<RenderEmailBaseRequest>(event, { bodyValidator, headerValidator })

    const { 'x-api-key': system } = request.headers

    // AWS Lambda Callback configuration
    console.log('Render sync invocation start')
    const { Payload } = await Render({ ...request.body, system })
    const { htmls }: { htmls: string[] } = JSON.parse(_.toString(Payload))
    console.log('Render sync invocation end - Payload', Payload, ' - htmls', htmls)

    response.json({ htmls })
  } catch (error) {
    console.error(error)
    response.status(error?.statusCode ?? 500).json({ error: error?.message })
  }

  return response.result
}