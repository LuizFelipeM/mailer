import { Partials } from "./Handlebars";

export interface SaveEmailRequest {
  template: string
  trigger: string
  emails: string[]
}

export interface SavePartiaslRequest {
  partials: Partials
}