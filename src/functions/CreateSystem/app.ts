import _ from "lodash"
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { tbSystems } from "../../common/tables"
import { api } from "../../common/apiBuilders"
import { CreateSystemRequest } from "../../interfaces/CreateSystemRequest"
import { bodyValidator } from "./bodyValidator"

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const response = api.resultBuilder

  try {
    const request = api.requestBuilder<CreateSystemRequest>(event, { bodyValidator })

    const { email: source, systemName } = request.body

    const apiKey = await tbSystems.saveItem({ systemName, source })
    
    response.json({ apiKey })
  } catch (error) {
    console.error(error)
    response.status(error?.statusCode ?? 500).json({ error: error?.message })
  }

  return response.result
}