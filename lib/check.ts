import { IDataTypes, Idle } from '../src/interfaces'

/**
 * @function check
 * @desc Returns the actual type of the value (s) entered.
 * @param value
 */
export const check = <V>(value: V): IDataTypes => {
  let checkedValue = 'null'

  try {
    if (typeof value === 'undefined') {
      checkedValue = 'undefined'
    } else {
      checkedValue = (value as Idle).constructor.name.toLowerCase()
    }
  } catch {}

  return checkedValue as IDataTypes
}
