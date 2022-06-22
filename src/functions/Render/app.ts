import _ from "lodash"
import { compile, registerPartial } from "handlebars"
import { tbPartials, tbTemplates } from "../../common/tables"
import { RenderEmailRequest } from "../../interfaces/RenderEmailRequest"

interface Partial {
  id: string
  system: string
  name: string
  template: string
}

const registerPartials = ({ name, template }: Partial): void => registerPartial(name, template)

const registerAllPartials = (auth: string) => tbPartials
  .query({
    KeyConditionExpression: "#auth = :auth",
    ExpressionAttributeNames: { '#auth': 'system' },
    ExpressionAttributeValues: { ':auth': auth }
  })
  .then(({ Items: partials }) => {
    if(partials && !_.isEmpty(partials))
      partials.forEach(({ name, system, id, template }) => {
        if(!(_.isEmpty(name) || _.isEmpty(template)))
          registerPartials({ name, system, id, template })
        else
          throw Error(`Partial registration error - Id ${id} - System ${system} - Name ${name} - Template ${template}`)
      })
  })

export const handler = async (request: RenderEmailRequest) => {
  console.log(request)

  const { system, trigger, data } = request

  const { Items } = await tbTemplates.query({
    KeyConditionExpression: "#auth = :auth and #trig = :trig",
    ExpressionAttributeNames: {
      '#auth': 'system',
      '#trig': 'trigger'
    },
    ExpressionAttributeValues: {
      ':auth': system,
      ':trig': trigger
    }
  })
  
  if(Items && !_.isEmpty(Items)){
    await registerAllPartials(system)

    return {
      htmls: Items.map(({ template }) => compile(template)(data))
    }
  } else
    throw Error('Template not found')
}