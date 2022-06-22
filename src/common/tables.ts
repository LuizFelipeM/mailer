import dynamo from "./dynamoConnection";

export const tbSystems = dynamo('systems')
export const tbTemplates = dynamo('templates')
export const tbPartials = dynamo('partials')