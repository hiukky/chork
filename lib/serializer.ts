import { Constructors } from '../src/interfaces'
import { PRIMITIVES } from '../src/constants'
import { check } from './check'

export class Serializer {
  private parseToPrimitive<V, P = any>(value: V): P {
    let parsed: any

    try {
      parsed = JSON.parse(
        check(value) === 'string' ? String(value) : JSON.stringify(value),
      )
    } catch {
      parsed = String(value)
    }

    return parsed
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

  public deserialize<V extends unknown, C extends Constructors>(
    value: unknown,
    Type: C = {} as C,
  ): V {
    let parsed = this.parseToPrimitive(value)

    const types = this.getTypes(value, Type)

    switch (types.target) {
      case 'array':
        parsed = this.toArray(parsed)
        break
      case 'object':
        parsed = this.toObject(parsed)
        break
      case 'undefined':
      default:
        if ([value, types.source].includes('undefined')) {
          parsed = undefined
        } else if ([value, types.source].includes('null')) {
          parsed = null
        } else if (['array', 'object'].includes(types.source)) {
          if (!this.isPrimitiveTarget(Type)) {
            parsed = Object.assign(Type?.prototype ? new Type() : {}, parsed)
          } else {
            parsed = this.deserialize(parsed, this.getPrimitive(parsed))
          }
        }
        break
    }

    return parsed
  }
}
