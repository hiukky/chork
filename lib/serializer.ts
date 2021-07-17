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

  private isSerializable<S extends string, V>(source: S, value: V): boolean {
    return ['array', 'object'].includes(source) || source !== check(value)
  }

  public serialize = <V extends unknown>(value: V): string =>
    JSON.stringify(this.deserialize(value))

  public deserialize = <V extends unknown>(
    value: unknown,
    Type: Constructors = {} as Constructors,
  ): V => {
    let deserialized = this.parseToPrimitive(value)

    const types = this.getTypes(value, Type)

    switch (types.target) {
      case 'array':
        return this.toArray(deserialized)

      case 'object':
        return this.toObject(deserialized)

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
