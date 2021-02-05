import { checkAll } from '../lib/checkAll'

describe('CheckAll', () => {
  it('should create a context for values [1, true, "bar"]', () => {
    expect(checkAll([1, true, 'bar'])).toEqual({
      '1': 'number',
      true: 'boolean',
      bar: 'string',
    })
  })

  it('should create a context for values {foo:1, bar: true, date: new Date()}', () => {
    expect(checkAll({ foo: 1, bar: true, date: new Date() })).toEqual({
      foo: 'number',
      bar: 'boolean',
      date: 'date',
    })
  })

  it('should create a context for values {foo:1, bar: true, date: new Date()}', () => {
    expect(checkAll(BigInt(9007199254740991))).toEqual({
      9007199254740991: 'bigint',
    })
  })
})
