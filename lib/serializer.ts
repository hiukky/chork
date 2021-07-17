import { Constructors, DeserializerOptions } from '../src/interfaces'
import { PRIMITIVES } from '../src/constants'
import { check } from './check'
import { SerializerError } from './exception'

class Serializer {
  private get $options(): Required<DeserializerOptions> {
    return {
      type: {} as Constructors,
      strict: true,
    }
  }

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
      this.deserialize(item, { type: this.getPrimitiveOf(item) }),
    ) as V
  }

  private toObject<V extends Record<string, any>>(value: V): V {
    const source: V = { ...value }

    Object.keys(source).forEach((key: keyof V) => {
      source[key] = this.deserialize(source[key], {
        type: this.getPrimitiveOf(source[key]),
      })
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

  private getPrimitiveOf<V>(value: V): Constructors {
    return PRIMITIVES[check(value)] as Constructors
  }

  private valueOf<V, P = any>(value: V, strict: boolean): P {
    let deserialized: any

    try {
      deserialized = JSON.parse(
        check(value) === 'string' ? String(value) : JSON.stringify(value),
      )
    } catch (e) {
      let error = new SerializerError(e as Error, {
        details: 'Error parsing value',
        value: String(value),
      })

      if (this.isDate(value)) {
        deserialized = this.toDate(value)
      } else if (this.isTime(value)) {
        deserialized = this.timeToDateTime(value)
      } else if (strict && error.getErrorPosition > 1) {
        throw error
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
    options?: DeserializerOptions,
  ): V => {
    const { strict, type: Type } = { ...this.$options, ...options }

    let deserialized = this.valueOf(value, strict)

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
          return this.deserialize(deserialized, {
            type: this.getPrimitiveOf(deserialized),
          })
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
