import { check } from './check'
import { IDataTypesObject, Idle } from '../src/interfaces'

/**
 * @function createContext
 *
 * @desc Creates a context for the current status check.
 *
 * @param values
 */
const createContext = <V>(
  values: V,
): Record<'type' | 'data' | 'schema' | 'payload', Idle> => ({
  schema: {},
  payload: {},
  type: check(values),
  data: values,
})

/**
 * @function checkAll
 * @desc Returns the type for all values entered.
 * @param values
 */
export const checkAll = <V>(values: V): IDataTypesObject<V> => {
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
