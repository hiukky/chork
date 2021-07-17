import { deserialize, serialize } from '../lib/serializer'
import { check } from '../lib/check'

describe('Serializer', () => {
  let serialized = null

  it('Must serialize an object to String.', () => {
    serialized = serialize({
      a: 1,
      b: true,
      c: ['Foo', 0, 'true', { e: 'true' }],
    })

    expect(serialized).toBe('{"a":1,"b":true,"c":["Foo",0,true,{"e":true}]}')
    expect(check(serialized)).toEqual('string')
  })
})

describe('Deserializer', () => {
  let deserialized = null

  describe('Undefined', () => {
    it('Must deserialize an undefined value and return undefined.', () => {
      deserialized = deserialize(undefined)

      expect(deserialized).toBe(undefined)
      expect(check(deserialized)).toEqual('undefined')
    })

    it('Must deserialize an "undefined" string value and return undefined.', () => {
      deserialized = deserialize('undefined')

      expect(deserialized).toBe(undefined)
      expect(check(deserialized)).toEqual('undefined')
    })
  })

  describe('Null', () => {
    it('Must deserialize an null value and return null.', () => {
      deserialized = deserialize(null)

      expect(deserialized).toBe(null)
      expect(check(deserialized)).toEqual('null')
    })

    it('Must deserialize an "null" string value and return null.', () => {
      deserialized = deserialize('null')

      expect(deserialized).toBe(null)
      expect(check(deserialized)).toBe('null')
    })
  })

  describe('String', () => {
    const execFor = (value: unknown): void => {
      expect(value).toBe('Foo Baa')
      expect(check(value)).toBe('string')
    }

    it('Must deserialize an string value and return String.', () => {
      execFor(deserialize('Foo Baa'))
      execFor(deserialize('Foo Baa', { type: Number }))
    })
  })

  describe('Number', () => {
    const execFor = (value: unknown): void => {
      expect(value).toBe(50)
      expect(check(value)).toBe('number')
    }

    it('Must deserialize an number value and return Number.', () => {
      execFor(deserialize(50))
      execFor(deserialize(50, { type: Number }))
    })

    it('Must deserialize an number string value and return Number.', () => {
      execFor(deserialize('50'))
      execFor(deserialize('50', { type: Number }))
    })
  })

  describe('Boolean', () => {
    const execFor = (value: unknown, expected: boolean): void => {
      expect(value).toBe(expected)
      expect(check(value)).toBe('boolean')
    }

    it('Must deserialize an boolean value and return Boolean.', () => {
      execFor(deserialize(true), true)
      execFor(deserialize(true, { type: Boolean }), true)

      execFor(deserialize('false'), false)
      execFor(deserialize('false', { type: Boolean }), false)
    })
  })

  describe('Array', () => {
    const execFor = (value: unknown, expected: any[]): void => {
      expect(value).toEqual(expected)
      expect(check(value)).toBe('array')
    }

    it('Must deserialize a string array to an Array', () => {
      const source = '[1,"2",3,4,5,"true","[]","{}"]'
      const expected = [1, 2, 3, 4, 5, true, [], {}]

      execFor(deserialize(source), expected)
      execFor(deserialize(source, { type: Array }), expected)
    })

    it('Must deserialize an array and return an Array of all deserialized items.', () => {
      const source = [
        1,
        'true',
        'foo',
        ['1', '2'],
        '{"a":1,"b":"A","c":true}',
        'Sat Jul 17 2021 17:12:54 GMT-0300 (Brasilia Standard Time)',
        '[]',
      ]
      const expected = [
        1,
        true,
        'foo',
        [1, 2],
        { a: 1, b: 'A', c: true },
        new Date('2021-07-17T20:12:54.000Z'),
        [],
      ]

      execFor(deserialize(source), expected)
      execFor(deserialize(source, { type: Array }), expected)
    })
  })

  describe('Object', () => {
    const execFor = (value: unknown, expected: Object): void => {
      expect(value).toEqual(expected)
      expect(check(value)).toBe('object')
    }

    it('Must deserialize a string JSON to an Object', () => {
      const source = '{"a":1,"b":"A","c":true,"d":"false"}'
      const expected = { a: 1, b: 'A', c: true, d: false }

      execFor(deserialize(source), expected)
      execFor(deserialize(source, { type: Object }), expected)
    })
  })

  describe('Date', () => {
    const date = new Date()
    const dateFromString = new Date(date.toString())

    const execFor = (value: unknown, expected: Date): void => {
      expect(value).toEqual(expected)
      expect(check(value)).toBe('date')
      expect(value).toBeInstanceOf(Date)
    }

    it('Must deserialize a date to an instance of Date.', () => {
      execFor(deserialize(date), date)
      execFor(deserialize(date, { type: Date }), date)
    })

    it('Must deserialize a date string to an instance of Date.', () => {
      execFor(deserialize(date.toString()), dateFromString)
      execFor(deserialize(date.toString(), { type: Date }), dateFromString)
    })

    it('Must deserialize a date ISO string to an instance of Date.', () => {
      execFor(deserialize(date.toISOString()), date)
      execFor(deserialize(date.toISOString(), { type: Date }), date)
    })

    it('Must deserialize a date UTC string to an instance of Date.', () => {
      execFor(deserialize(date.toUTCString()), dateFromString)
      execFor(deserialize(date.toUTCString(), { type: Date }), dateFromString)
    })

    it('Must deserialize a date Locale string to an instance of Date.', () => {
      execFor(deserialize(date.toLocaleString()), dateFromString)
      execFor(
        deserialize(date.toLocaleString(), { type: Date }),
        dateFromString,
      )
    })

    it('Must deserialize a Time string to an instance of Date.', () => {
      const expected = new Date(
        dateFromString.toISOString().replace(/\d{4}-\d{2}-\d{2}/, '1970-01-01'),
      )

      execFor(deserialize(date.toTimeString()), expected)
      execFor(deserialize(date.toTimeString(), { type: Date }), expected)
    })
  })

  describe('Class instance', () => {
    class DTO {
      a: number

      b: string

      c: boolean
    }

    const execFor = (value: unknown, expected: DTO): void => {
      expect(value).toEqual(expected)
      expect(check(value)).toBe('dto')
      expect(value).toBeInstanceOf(DTO)
    }

    it('Must deserialize a string JSON to an Class instance.', () => {
      const source = '{"a":1,"b":"A","c":true}'
      const expected = { a: 1, b: 'A', c: true }

      execFor(deserialize<DTO>(source, { type: DTO }), expected)
    })

    it('Must deserialize a JSON to an Class instance.', () => {
      const source = { a: 1, b: 'A', c: true }
      const expected = Object.assign(new DTO(), source)

      execFor(deserialize<DTO>(source, { type: DTO }), expected)
    })
  })
})
