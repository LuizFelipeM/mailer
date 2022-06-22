import { ValidatorResponse } from "../interfaces/ValidatorResponse"

type Condition<T> = (request: T) => boolean

export function bodyValidatorBuilder<T>(request: T){
  const conditions: Array<{ condition: Condition<T>, error: string }> = []
  
  return {
    addRule(condition: Condition<T>, error: string){
      conditions.push({ condition, error })
      return this
    },

    validate: (): ValidatorResponse => conditions
      .reduce<ValidatorResponse>((prev, cur) => {
        const currentIsValid = !cur.condition(request)
        const currentError = currentIsValid ? [] : [cur.error]
        
        return {
          isValid: prev.isValid && currentIsValid,
          errors: [...prev.errors, ...currentError]
        }
      },
      { isValid: true, errors: [] })
  }
}