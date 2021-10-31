/* eslint-disable @typescript-eslint/ban-types */
import * as yup from 'yup'

export async function validate<
  T extends object | null | undefined = object | undefined
>(data: unknown, schema: yup.ObjectSchema<T>) {
  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  })
}
