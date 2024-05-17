type FormDataToObject<T> = {
  [P in keyof T]: T[P] | T[P][]
}

export const formDataToObject = <T extends Record<string, any>>(formData: FormData): FormDataToObject<T> => {
  const object: Partial<FormDataToObject<T>> = {}
  formData.forEach((value, key) => {
    const itemKey = key as keyof typeof object
    object[itemKey] = value as any
  })
  return object as FormDataToObject<T>
}
