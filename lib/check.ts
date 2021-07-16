import { DataTypes, Idle } from '../src/interfaces'

export const check = <V>(value: V): DataTypes => {
  let checkedValue = 'null'

  try {
    checkedValue =
      typeof value === 'undefined'
        ? 'undefined'
        : (value as Idle).constructor.name.toLowerCase()
  } catch {}

  return checkedValue as DataTypes
}
