/**
 * Util to build a proper user readable error message from ZodError.errors object
 * @param errors Array from ZodError.errors
 * @param key Key / fieldname to query errors for
 * @returns User readable error message
 */
export const getFirstErrorMessage = <T extends string>(errors: { [k in T]: { _errors: string[] } }, key: T) => {
  return errors?.[key]?._errors?.[0]?.replace('String', 'Field')
}
