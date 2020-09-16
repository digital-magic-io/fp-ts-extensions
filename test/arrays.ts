import * as assert from 'assert'
import { foldCurried } from '../src/Array'
import { fold, getIntercalateSemigroup, semigroupString } from 'fp-ts/Semigroup'

describe('arrays', () => {
  it('foldCurried', () => {
    const urlPathSemigroup = getIntercalateSemigroup('/')(semigroupString)
    const foldUrlPath = fold(urlPathSemigroup)
    const appendUrlPaths = foldCurried(foldUrlPath)
    assert.strictEqual(appendUrlPaths('my')('path', 'is', '...'), 'my/path/is/...')
  })
})
