import assert from 'assert'
import regexEach from './index'

describe('Regex Each', () => {

  it('iterates a string', () => {
    const values = ['a', 'b', 'c'].reverse()

    regexEach(/[abc]/g, 'abc', (match) => {
      const [val] = match
      assert.strictEqual(val, values.pop())
    })

    assert.strictEqual(values.length, 0)
  })

  it('forces global flag', () => {
    const values = ['a', 'b', 'c'].reverse()

    regexEach(/a/, 'a', (match, expr) => {
      values.pop()
      assert(expr.global)
    })

    assert.strictEqual(values.length, 2)

    regexEach('a', 'a', (match, expr) => {
      values.pop()
      assert(expr.global)
    })

    assert.strictEqual(values.length, 1)
  })

  it('allows string expressions', () => {
    const values = ['a', 'b', 'c'].reverse()

    regexEach('[abc]', 'abc', (match) => {
      const [val] = match
      assert.strictEqual(val, values.pop())
    })

    assert.strictEqual(values.length, 0)
  })

  it('works with sticky flag', () => {
    const values: string[] = []

    regexEach(/[abc]/y, 'abc', (match, expr) => {
      const [val] = match
      values.push(val)

      // Skip letter 'b'.
      if (expr.lastIndex === 1) {
        expr.lastIndex = 2
      }
    })

    assert.deepStrictEqual(values, ['a', 'c'])
  })
})
