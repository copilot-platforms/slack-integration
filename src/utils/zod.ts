/**
 * Util to build a proper user readable error message from ZodError.errors object
 * @param errors Array from ZodError.errors
 * @param key Key / fieldname to query errors for
 * @returns User readable error message
 */

import { ZodFormattedError } from 'zod'

export const getFirstErrorMessage = <T extends Record<string, unknown>>(
  errors: ZodFormattedError<T, string>,
  key: keyof T,
): string | undefined => {
  return errors?.[key]?._errors?.[0]?.replace('String', 'Field')
}
