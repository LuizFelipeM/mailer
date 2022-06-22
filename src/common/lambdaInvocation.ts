import { Lambda } from "aws-sdk";
import { RenderEmailRequest } from "../interfaces/RenderEmailRequest";
import { SendEmailRequest } from "../interfaces/SendEmailRequest";

const lambda = new Lambda()

export const SendEmail = (payload: SendEmailRequest) => lambda
  .invoke({
    FunctionName: 'SendEmail',
    InvocationType: 'Event',
    Payload: JSON.stringify(payload)
  })
  .promise()

export const Render = (payload: RenderEmailRequest) => lambda
  .invoke({
    FunctionName: 'Render',
    Payload: JSON.stringify(payload)
  })
  .promise()

export interface RenderPayload { htmls: string[] }