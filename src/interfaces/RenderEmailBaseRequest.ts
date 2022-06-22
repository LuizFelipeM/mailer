import { TemplateData } from "./Handlebars";

export interface RenderEmailBaseRequest {
  trigger: string
  data: TemplateData
}