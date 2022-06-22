import _ from "lodash"
import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { bodyValidator } from "./bodyValidator"
import { api } from "../../common/apiBuilders"
import { SavePartiaslRequest } from "../../interfaces/SaveEmailRequest"
import { KeyValuePair } from "../../interfaces/Generic"
import { tbPartials } from "../../common/tables"
import { apiKeyValidator as headerValidator } from "../../common/apiKeyValidator"

export const handler: APIGatewayProxyHandlerV2 = async (event, context, callback) => {
  const response = api.resultBuilder
  
  try {
    const request = api.requestBuilder<SavePartiaslRequest>(event, { bodyValidator, headerValidator })

    const { 'x-api-key': system } = request.headers
    const { partials } = request.body
    
    const partialArray: KeyValuePair[] = []
  
    _.forIn(partials, (partial, name) => partialArray.push({ system, name, template: partial }))

    console.log('partialArray', partialArray, 'system', system, 'request', request)

    const ids = await tbPartials.saveItems(partialArray)
    
    response.json({ ids })
  } catch(error) {
    console.error(error)
    response.status(error?.statusCode ?? 500).json({ error: error?.message })
  }

  return response.result
}

