import { DynamoDB } from 'aws-sdk'
import { v4 } from 'uuid'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { DynamoClient } from '../interfaces/Dynamo'
import { KeyValuePair } from '../interfaces/Generic'

const connection = new DynamoDB.DocumentClient()

function dynamo(tableName: string): DynamoClient {
  const TableName = tableName

  const saveDeleteItems = (Request: 'PutRequest' | 'DeleteRequest') => async (items: KeyValuePair[]) => {
    const ids: string[] = []
    
    await connection.batchWrite({
      RequestItems: {
        [tableName]: items
          .map(item => {
            const id = v4()
            ids.push(id)

            return Request === 'PutRequest' ?
              ({ [Request]: { Item: { id, ...item } } }) :
              ({ [Request]: { Key: item } })
          })
      }
    })
    .promise()

    return ids
  }

  const saveItem = async (item: KeyValuePair) => {
    const id = v4()
    await connection.put({ Item: { id, ...item }, TableName }).promise()
    return id
  }

  return {
    saveItem,
    query: (queryInput?: Omit<DocumentClient.QueryInput, 'TableName'>) => connection.query({ TableName, ...queryInput }).promise(),
    scan: (scanInput?: Omit<DocumentClient.ScanInput, 'TableName'>) => connection.scan({ TableName, ...scanInput }).promise(),
    get: (Keys: KeyValuePair[]) => connection.batchGet({ RequestItems: { [TableName]: { Keys } } }).promise(),
    replaceItem: (Item: KeyValuePair) => connection.put({ Item, TableName }).promise(),
    removeItem: (Key: KeyValuePair) => connection.delete({ Key, TableName }).promise(),
    saveItems: saveDeleteItems('PutRequest'),
    removeItems: saveDeleteItems('DeleteRequest')
  }
}

export default dynamo