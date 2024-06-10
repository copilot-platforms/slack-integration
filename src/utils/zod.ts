import { ZodError } from 'zod'

/**
 * Returns the first priority error only for a list of ZodErrors for a field
 * By default zod fieldErrors is a string array joined together which looks ugly
 */
export const getFirstFieldError = (error: ZodError) => {
  const errors = error.formErrors.fieldErrors
  let formattedErrors: { [x: string | number | symbol]: string | undefined } = {}
  Object.keys(errors).forEach((field) => {
    if (errors[field]) {
      formattedErrors[field] = errors[field]?.[0]
    }
  })
  return formattedErrors
}
