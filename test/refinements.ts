import assert from 'assert'
import {
  dateInFutureRefinement,
  dateInPastRefinement,
  hasValueRefinement,
  inRangeRefinement,
  nonEmptyDistinctArrayRefinement,
  nonEmptyOptionalStringRefinement,
  regexRefinement,
  stringLengthRefinement
} from '../src/refinements'

describe('refinements', () => {
  it('hasValueRefinement', () => {
    const refinement = hasValueRefinement<string>()
    assert.strictEqual(refinement('word'), true)
    assert.strictEqual(refinement(''), true)
    assert.strictEqual(refinement(undefined), false)
    assert.strictEqual(refinement(null), false)
  })
  it('nonEmptyDistinctArrayRefinement', () => {
    const refinement = nonEmptyDistinctArrayRefinement<ReadonlyArray<string>>()
    assert.strictEqual(refinement(['word']), true)
    assert.strictEqual(refinement(['']), true)
    assert.strictEqual(refinement(['word', 'another']), true)
    assert.strictEqual(refinement(['word', 'word']), false)
    assert.strictEqual(refinement(['word', 'another', 'word']), false)
    assert.strictEqual(refinement([]), false)
  })
  it('nonEmptyOptionalStringRefinement', () => {
    const refinement = nonEmptyOptionalStringRefinement<string>()
    assert.strictEqual(refinement('word'), true)
    assert.strictEqual(refinement(''), false)
    assert.strictEqual(refinement(undefined), false)
  })
  it('stringLengthRefinement', () => {
    const refinement = stringLengthRefinement<string>(2, 4)
    assert.strictEqual(refinement('word'), true)
    assert.strictEqual(refinement('wo'), true)
    assert.strictEqual(refinement('wordw'), false)
    assert.strictEqual(refinement('wordword'), false)
    assert.strictEqual(refinement('w'), false)
    assert.strictEqual(refinement(''), false)
  })
  it('regexRefinement', () => {
    const timeRegex = /^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/
    const refinement = regexRefinement<string>(timeRegex)
    assert.strictEqual(refinement('1:00'), true)
    assert.strictEqual(refinement('12:59'), true)
    assert.strictEqual(refinement('a12:59'), false)
    assert.strictEqual(refinement('12:59a'), false)
    assert.strictEqual(refinement('12:60'), false)
    assert.strictEqual(refinement('word'), false)
  })
  it('inRangeRefinement', () => {
    const refinement = inRangeRefinement<number>(2, 4)
    assert.strictEqual(refinement(2), true)
    assert.strictEqual(refinement(3), true)
    assert.strictEqual(refinement(4), true)
    assert.strictEqual(refinement(-1), false)
    assert.strictEqual(refinement(0), false)
    assert.strictEqual(refinement(1), false)
    assert.strictEqual(refinement(5), false)
    assert.strictEqual(refinement(105), false)
  })
  it('dateInPastRefinement & dateInFutureRefinement', () => {
    const pastRefinement = dateInPastRefinement<Date>()
    const futureRefinement = dateInFutureRefinement<Date>()
    const currentMillis = new Date().getUTCMilliseconds()
    const futureDt = new Date()
    const dayMillis = 1000 * 60 * 60 * 24
    futureDt.setUTCMilliseconds(currentMillis + dayMillis)
    const pastDt = new Date()
    pastDt.setUTCMilliseconds(currentMillis - dayMillis)
    assert.strictEqual(pastRefinement(pastDt), true)
    assert.strictEqual(pastRefinement(futureDt), false)
    assert.strictEqual(pastRefinement(new Date()), false)
    assert.strictEqual(futureRefinement(pastDt), false)
    assert.strictEqual(futureRefinement(futureDt), true)
    assert.strictEqual(futureRefinement(new Date()), false)
  })
})
