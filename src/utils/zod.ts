import { ZodError } from 'zod'

/**
 * Format errors properly - by default zod fieldErrors is a string array joined together by nothing which looks ugly
 */
export const buildFormattedFieldErrors = (error: ZodError) => {
  const errors = error.formErrors.fieldErrors
  let formattedErrors: { [x: string | number | symbol]: string | undefined } = {}
  Object.keys(errors).forEach((field) => {
    if (errors[field]) {
      formattedErrors[field] = errors[field]?.join(', ')
    }
  })
  return formattedErrors
}
