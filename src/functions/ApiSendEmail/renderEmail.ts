import _ from "lodash"
import { Render, RenderPayload } from "../../common/lambdaInvocation"
import { ApiSendEmailRequest } from "../../interfaces/ApiSendEmailRequest"
import { mapRender } from "./mapper"

export const renderEmail = async (system: string, request: ApiSendEmailRequest) => {
  console.log('Render sync invocation start')
  
  const renderRequest = mapRender(request)
  const { Payload } = await Render({ ...renderRequest, system })
  const { htmls }: RenderPayload = JSON.parse(_.toString(Payload))

  console.log('Render sync invocation end')

  return htmls
}