import { Constructors } from '../src/interfaces'
import { PRIMITIVES } from '../src/constants'
import { check } from './check'

class Serializer {
  private isDate<V extends unknown>(value: V): boolean {
    return !Number.isNaN(Date.parse(String(value)))
  }

  private isTime<V extends unknown>(value: V): boolean {
    return /^\d{2}:\d{2}:\d{2}\sGMT-\d{4}.+$/.test(String(value))
  }

  private isPrimitiveTarget(type?: Constructors): boolean {
    return Object.keys(PRIMITIVES).includes(
      String(type?.prototype?.constructor.name).toLowerCase(),
    )
  }

  private isSerializable<S extends string, V>(source: S, value: V): boolean {
    return (
      ['array', 'object', 'date'].includes(source) || source !== check(value)
    )
  }

  private toArray<V extends Array<any>>(value: V): V {
    return Array.from(value).map(item =>
      this.deserialize(item, this.getPrimitive(item)),
    ) as V
  }

  private toObject<V extends Record<string, any>>(value: V): V {
    const source: V = { ...value }

    Object.keys(source).forEach((key: keyof V) => {
      source[key] = this.deserialize(
        source[key],
        this.getPrimitive(source[key]),
      )
    })

    return source as V
  }

  private toDate<V extends any>(value: V): V {
    return new Date(String(value)) as V
  }

  private timeToDateTime<V extends any>(value: V): V {
    return new Date(
      new Date(0).toUTCString().replace(/\d{2}:\d{2}:\d{2}.+/, String(value)),
    ) as V
  }

  private getPrimitive<V>(value: V): Constructors {
    return PRIMITIVES[check(value)] as Constructors
  }

  private valueOf<V, P = any>(value: V): P {
    let deserialized: any

    try {
      deserialized = JSON.parse(
        check(value) === 'string' ? String(value) : JSON.stringify(value),
      )
    } catch {
      if (this.isDate(value)) {
        deserialized = this.toDate(value)
      } else if (this.isTime(value)) {
        deserialized = this.timeToDateTime(value)
      } else {
        deserialized = String(value)
      }
    }

    return deserialized
  }

  public serialize = <V extends unknown>(value: V): string =>
    JSON.stringify(this.deserialize(value))

  public deserialize = <V extends unknown>(
    value: unknown,
    Type: Constructors = {} as Constructors,
  ): V => {
    let deserialized = this.valueOf(value)

    const types = {
      source: check(value),
      target: check(Type?.prototype),
    }

    switch (types.target) {
      case 'array':
        return this.toArray(deserialized)

      case 'object':
        return this.toObject(deserialized)

      case 'date':
        return this.toDate(deserialized)

      case 'undefined':
      case 'null':
      default:
        if (!this.isPrimitiveTarget(Type)) {
          return Object.assign(new Type(), deserialized)
        }

        if (this.isSerializable(types.source, deserialized)) {
          return this.deserialize(deserialized, this.getPrimitive(deserialized))
        }

        if ([value, types.source].includes('undefined')) {
          return undefined as V
        }

        if ([value, types.source].includes('null')) {
          return null as V
        }

        break
    }

    return deserialized
  }
}

export const { deserialize, serialize } = new Serializer()
