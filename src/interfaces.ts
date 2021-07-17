import { PRIMITIVES } from './constants'

export interface Constructor extends Function {
  new (...args: any[]): {}
}

export type DataTypes = keyof typeof PRIMITIVES

export type Constructors =
  | typeof PRIMITIVES[Exclude<
      DataTypes,
      'symbol' | 'bigint' | 'undefined' | 'null'
    >]
  | Constructor

export type DataTypesOf<V> = Record<keyof V, DataTypes>

export type Idle = unknown | any

export type DeserializerOptions = {
  type: Constructors
  strict?: boolean
}
