import { deserialize, serialize } from '../lib/serializer'
import { check } from '../lib/check'

describe('Serializer', () => {
  it('Must serialize an object to String.', () => {
    const serialized = serialize({
      a: 1,
      b: true,
      c: ['Foo', 0, 'true', { e: 'true' }],
    })

    expect(serialized).toBe('{"a":1,"b":true,"c":["Foo",0,true,{"e":true}]}')
    expect(check(serialized)).toEqual('string')
  })
})

describe('Deserializer', () => {
  describe('Undefined', () => {
    it('Must deserialize an undefined value and return undefined.', () => {
      const deserialized = deserialize(undefined)

      expect(deserialized).toBe(undefined)
      expect(check(deserialized)).toEqual('undefined')
    })

    it('Must deserialize an "undefined" string value and return undefined.', () => {
      const deserialized = deserialize('undefined')

      expect(deserialized).toBe(undefined)
      expect(check(deserialized)).toEqual('undefined')
    })
  })

  describe('Null', () => {
    it('Must deserialize an null value and return null.', () => {
      const deserialized = deserialize(null)

      expect(deserialized).toBe(null)
      expect(check(deserialized)).toEqual('null')
    })

    it('Must deserialize an "null" string value and return null.', () => {
      const deserialized = deserialize('null')

      expect(deserialized).toBe(null)
      expect(check(deserialized)).toBe('null')
    })
  })

  describe('String', () => {
    it('Must deserialize an string value and return String.', () => {
      const deserialized = deserialize('Foo Baa')

      expect(deserialized).toBe('Foo Baa')
      expect(check(deserialized)).toBe('string')
    })
  })

  describe('Number', () => {
    it('Must deserialize an number value and return Number.', () => {
      const deserialized = deserialize(50)

      expect(deserialized).toBe(50)
      expect(check(deserialized)).toBe('number')
    })

    it('Must deserialize an number string value and return Number.', () => {
      const deserialized = deserialize('100')

      expect(deserialized).toBe(100)
      expect(check(deserialized)).toBe('number')
    })
  })

  describe('Boolean', () => {
    it('Must deserialize an boolean value and return Boolean.', () => {
      expect(deserialize(true)).toBe(true)
      expect(deserialize(false)).toBe(false)

      expect(check(deserialize(true))).toBe('boolean')
      expect(check(deserialize(false))).toBe('boolean')
    })

    it('Must deserialize an boolean string value and return Boolean.', () => {
      expect(deserialize('true')).toBe(true)
      expect(deserialize('false')).toBe(false)

      expect(check(deserialize('true'))).toBe('boolean')
      expect(check(deserialize('false'))).toBe('boolean')
    })
  })

  describe('Array', () => {
    it('Must deserialize a string array to an Array', () => {
      const deserialized = deserialize('[1,"2",3,4,5,"true","[]","{}"]')

      expect(deserialized).toEqual([1, 2, 3, 4, 5, true, [], {}])
      expect(check(deserialized)).toBe('array')
    })

    it('Must deserialize an array and return an Array of all deserialized items.', () => {
      const deserialized = deserialize([
        1,
        'true',
        'foo',
        ['1', '2'],
        '{"a":1,"b":"A","c":true}',
        '[]',
      ])

      expect(deserialized).toEqual([
        1,
        true,
        'foo',
        [1, 2],
        { a: 1, b: 'A', c: true },
        [],
      ])
      expect(check(deserialized)).toBe('array')
    })
  })

  describe('Object', () => {
    it('Must deserialize a string JSON to an Object', () => {
      const deserialized = deserialize('{"a":1,"b":"A","c":true}')

      expect(deserialized).toEqual({ a: 1, b: 'A', c: true })
      expect(check(deserialized)).toBe('object')
    })

    it('Must deserialize an object JSON and return an Object of all deserialized items.', () => {
      const deserialized = deserialize({
        a: '1',
        b: 'A',
        c: 'true',
      })

      expect(deserialized).toEqual({ a: 1, b: 'A', c: true })
      expect(check(deserialized)).toBe('object')
    })
  })
})
