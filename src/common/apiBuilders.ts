import _ from "lodash";
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { KeyValuePair } from "../interfaces/Generic";
import { ValidatorResponse } from "../interfaces/ValidatorResponse";
import { ApiError } from "./ApiError";

export interface APIGatewayRequestBuilder<T> {
  params: KeyValuePair<string>
  headers: KeyValuePair<string>
  body: T
}

export interface APIGatewayResultBuilder {
  result: APIGatewayProxyResult
  status: (code: number) => APIGatewayResultBuilder
  json: (body: KeyValuePair | undefined) => APIGatewayResultBuilder
}

interface Validators<T> {
  headerValidator?: (headers: KeyValuePair<string>) => ValidatorResponse
  bodyValidator?: (requestBody: T) => ValidatorResponse
}

const requestBuilder = <T>(event: APIGatewayProxyEventV2, validators?: Validators<T>): APIGatewayRequestBuilder<T> => {
  const body: T = JSON.parse(_.toString(event.body))
  const headers = _.mapValues(event.headers, _.toString)

  if(validators?.bodyValidator){
    const { isValid, errors } = validators.bodyValidator(body)
    
    if(!isValid)
      throw new ApiError(400, `Errors encountered on request body: ${errors.join(', ')}`)
  }

  if(validators?.headerValidator){
    const { isValid, errors } = validators.headerValidator(headers)
    
    if(!isValid)
      throw new ApiError(401, `Errors encountered on request headers: ${errors.join(', ')}`)
  }

  return {
    body,
    headers,
    params: _.mapValues(event.pathParameters, _.toString),
  }
}

const resultBuilder = (): APIGatewayResultBuilder => {
  const result = { statusCode: 204, body: JSON.stringify(undefined) }
  
  return {
    result,

    status(code: number) {
      result.statusCode = code
      return this
    },
    json(body: KeyValuePair | undefined) {
      result.body = JSON.stringify(body)
      result.statusCode = result.statusCode === 204 ? 200 : result.statusCode
      return this
    }
  }
}

export const api = {
  requestBuilder,
  resultBuilder: resultBuilder()
}