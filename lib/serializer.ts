import { Constructors } from '../src/interfaces'
import { PRIMITIVES } from '../src/constants'
import { check } from './check'

class Serializer {
  private parseToPrimitive<V, P = any>(value: V): P {
    let deserialized: any

    try {
      deserialized = JSON.parse(
        check(value) === 'string' ? String(value) : JSON.stringify(value),
      )
    } catch {
      deserialized = String(value)
    }

    return deserialized
  }

  private getPrimitive<V>(value: V): Constructors {
    return (PRIMITIVES as any)[check(value)]
  }

  private getTypes<V extends any, C extends Constructors>(
    value: V,
    type: C = {} as C,
  ) {
    return {
      source: check(value),
      target: check(type?.prototype),
    }
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

  private isPrimitiveTarget(type?: Constructors): boolean {
    return Object.keys(PRIMITIVES).includes(
      String(type?.prototype?.constructor.name).toLowerCase(),
    )
  }

  public serialize = <V extends unknown>(value: V): string =>
    JSON.stringify(this.deserialize(value))

  public deserialize = <V extends unknown, C extends Constructors>(
    value: unknown,
    Type: C = {} as C,
  ): V => {
    let deserialized = this.parseToPrimitive(value)

    const types = this.getTypes(value, Type)

    switch (types.target) {
      case 'array':
        deserialized = this.toArray(deserialized)
        break
      case 'object':
        deserialized = this.toObject(deserialized)
        break
      case 'undefined':
      default:
        if ([value, types.source].includes('undefined')) {
          deserialized = undefined
        } else if ([value, types.source].includes('null')) {
          deserialized = null
        } else if (['array', 'object'].includes(types.source)) {
          if (!this.isPrimitiveTarget(Type)) {
            deserialized = Object.assign(
              Type?.prototype ? new Type() : {},
              deserialized,
            )
          } else {
            deserialized = this.deserialize(
              deserialized,
              this.getPrimitive(deserialized),
            )
          }
        } else if (types.source !== check(deserialized)) {
          deserialized = this.deserialize(
            deserialized,
            this.getPrimitive(deserialized),
          )
        }
        break
    }

    return deserialized
  }
}

export const { deserialize, serialize } = new Serializer()
