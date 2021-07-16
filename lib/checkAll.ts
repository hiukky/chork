import { check } from './check'
import { DataTypesOf, Idle } from '../src/interfaces'

const createContext = <V>(
  values: V,
): Record<'type' | 'data' | 'schema' | 'payload', Idle> => ({
  schema: {},
  payload: {},
  type: check(values),
  data: values,
})

export const checkAll = <V>(values: V): DataTypesOf<V> => {
  let { payload, schema, type, data } = createContext(values)

  if (type === 'array') {
    data.forEach((value: Idle) => {
      schema[value] = check(value)
    })

    payload = schema
  } else if (type === 'object') {
    Object.keys(values).forEach(arg => {
      schema[arg] = check(data[arg])
    })

    payload = schema
  } else {
    payload[data] = type
  }

  return payload
}
