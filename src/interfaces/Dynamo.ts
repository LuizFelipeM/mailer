import { AWSError } from "aws-sdk";
import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";
import { KeyValuePair } from "./Generic";

export interface DynamoClient {
  saveItem: (item: KeyValuePair) => Promise<string>
  query: (queryInput?: Omit<DocumentClient.QueryInput, 'TableName'>) => Promise<PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError>>
  scan: (scanInput?: Omit<DocumentClient.ScanInput, 'TableName'>) => Promise<PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>>
  get: (Keys: KeyValuePair[]) => Promise<PromiseResult<DynamoDB.DocumentClient.BatchGetItemOutput, AWSError>>
  replaceItem: (Item: KeyValuePair) => Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>>
  removeItem: (Key: KeyValuePair) => Promise<PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWSError>>
  saveItems: (items: KeyValuePair[]) => Promise<string[]>
  removeItems: (items: KeyValuePair[]) => Promise<string[]>
}