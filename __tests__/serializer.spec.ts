import { Serializer } from '../lib/serializer'
import { check } from '../lib/check'

const deserializer = new Serializer()

describe('Deserializer', () => {
  describe('Undefined', () => {
    it('Must deserialize an undefined value and return undefined.', () => {
      const deserialized = deserializer.deserialize(undefined)

      expect(deserialized).toBe(undefined)
      expect(check(deserialized)).toEqual('undefined')
    })

    it('Must deserialize an "undefined" string value and return undefined.', () => {
      const deserialized = deserializer.deserialize('undefined')

      expect(deserialized).toBe(undefined)
      expect(check(deserialized)).toEqual('undefined')
    })
  })

  describe('Null', () => {
    it('Must deserialize an null value and return null.', () => {
      const deserialized = deserializer.deserialize(null)

      expect(deserialized).toBe(null)
      expect(check(deserialized)).toEqual('null')
    })

    it('Must deserialize an "null" string value and return null.', () => {
      const deserialized = deserializer.deserialize('null')

      expect(deserialized).toBe(null)
      expect(check(deserialized)).toBe('null')
    })
  })

  describe('String', () => {
    it('Must deserialize an string value and return string.', () => {
      const deserialized = deserializer.deserialize('Foo Baa')

      expect(deserialized).toBe('Foo Baa')
      expect(check(deserialized)).toBe('string')
    })
  })

  describe('Number', () => {
    it('Must deserialize an number value and return number.', () => {
      const deserialized = deserializer.deserialize(50)

      expect(deserialized).toBe(50)
      expect(check(deserialized)).toBe('number')
    })

    it('Must deserialize an number string value and return number.', () => {
      const deserialized = deserializer.deserialize('100')

      expect(deserialized).toBe(100)
      expect(check(deserialized)).toBe('number')
    })
  })

  describe('Boolean', () => {
    it('Must deserialize an true value and return true.', () => {
      const deserialized = deserializer.deserialize(true)

      expect(deserialized).toBe(true)
      expect(check(deserialized)).toBe('boolean')
    })

    it('Must deserialize an "true" string value and return true.', () => {
      const deserialized = deserializer.deserialize('true')

      expect(deserialized).toBe(true)
      expect(check(deserialized)).toBe('boolean')
    })

    it('Must deserialize an false value and return false.', () => {
      const deserialized = deserializer.deserialize(false)

      expect(deserialized).toBe(false)
      expect(check(deserialized)).toBe('boolean')
    })

    it('Must deserialize an "false" string value and return false.', () => {
      const deserialized = deserializer.deserialize('false')

      expect(deserialized).toBe(false)
      expect(check(deserialized)).toBe('boolean')
    })
  })

  describe('Array', () => {
    it('Must deserialize an array and return an array of all deserialized items.', () => {
      const deserialized = deserializer.deserialize([
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
    it('Must deserialize an object JSON and return an object JSON of all deserialized items.', () => {
      const deserialized = deserializer.deserialize({
        a: '1',
        b: 'A',
        c: 'true',
      })

      expect(deserialized).toEqual({ a: 1, b: 'A', c: true })
      expect(check(deserialized)).toBe('object')
    })
  })
})
