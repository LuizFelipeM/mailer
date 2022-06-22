import { SES } from "aws-sdk"
import { SendEmailRequest } from "../../interfaces/SendEmailRequest"

const ses = new SES()

export const handler = async (request: SendEmailRequest) => {
  try {
    const { htmlBody, textBody, source, subject, reply, bcc, cc, to } = request
    
    const config: SES.Types.SendEmailRequest = {
      Source: source,
      ReplyToAddresses: reply,
      Destination: {
        BccAddresses: bcc,
        CcAddresses: cc,
        ToAddresses: to
      },
      Message: {
        Subject: { Charset: 'UTF-8', Data: subject },
        Body: {
          Html: { Charset: 'UTF-8', Data: htmlBody ?? '' },
          Text: { Charset: 'UTF-8', Data: textBody ?? '' }
        }
      }
    }
  
    console.log(`Sending SES email - config`, JSON.stringify(config))
    const { MessageId } = await ses.sendEmail(config).promise()
    console.log('Sent SES email - Message ID', MessageId)
  } catch (error) {
    console.error(`Error when sending SES email`, error)
  }
}

