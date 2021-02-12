import { check } from '../lib/check'

describe('Check', () => {
  describe('String', () => {
    it('should return "string"', () => {
      expect(check('foo')).toBe('string')
    })
  })

  describe('Number', () => {
    it('should return "number"', () => {
      expect(check(50)).toBe('number')
    })
  })

  describe('Bigint', () => {
    it('should return "bigint"', () => {
      expect(check(BigInt('0x1fffffffffffff'))).toBe('bigint')
    })
  })

  describe('Boolean', () => {
    it('should return "bigint"', () => {
      expect(check(true)).toBe('boolean')
    })
  })

  describe('Undefined', () => {
    it('should return "undefined"', () => {
      expect(check(undefined)).toBe('undefined')
    })
  })

  describe('Null', () => {
    it('should return "null"', () => {
      expect(check(null)).toBe('null')
    })
  })

  describe('Symbol', () => {
    it('should return "symbol"', () => {
      expect(check(Symbol())).toBe('symbol')
    })
  })

  describe('Object', () => {
    it('should return "object"', () => {
      expect(check({})).toBe('object')
    })

    it('should return "object"', () => {
      expect(check(new Object())).toBe('object')
    })
  })

  describe('Array', () => {
    it('should return "symbol"', () => {
      expect(check([])).toBe('array')
    })

    it('should return "symbol"', () => {
      expect(check(new Array())).toBe('array')
    })
  })

  describe('Map', () => {
    it('should return "map"', () => {
      expect(check(new Map())).toBe('map')
    })
  })

  describe('Date', () => {
    it('should return "date"', () => {
      expect(check(new Date())).toBe('date')
    })
  })

  describe('Function', () => {
    it('should return "function"', () => {
      expect(check(() => {})).toBe('function')
    })

    it('should return "function"', () => {
      expect(check(() => {})).toBe('function')
    })

    it('should return "function"', () => {
      const foo = function () {}
      expect(check(foo)).toBe('function')
    })
  })
})
