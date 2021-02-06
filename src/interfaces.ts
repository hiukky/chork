export type IDataTypes =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'undefined'
  | 'symbol'
  | 'null'
  | 'object'
  | 'array'
  | 'map'
  | 'date'
  | 'function'

export type IDataTypesObject<V> = Record<keyof V, IDataTypes>

export type Idle = unknown | any
