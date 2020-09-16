import * as assert from 'assert'
import { foldBrandedNullable, foldNullableString, mapNotNullable, mapNotNullablePair } from '../src/utils'
import { NullableString } from '@digital-magic/ts-common-utils/lib/type'

describe('utils', () => {
  it('foldNullableString', () => {
    const folder = foldNullableString('/')
    assert.strictEqual(folder('my', ['path']), 'my/path')
    assert.strictEqual(folder(null, ['path']), 'path')
    assert.strictEqual(folder('my', [null]), 'my')
    assert.strictEqual(folder(undefined, ['path']), 'path')
    assert.strictEqual(folder('my', [null]), 'my')
    assert.strictEqual(folder(null, [null]), '')
    assert.strictEqual(folder(undefined, [undefined]), '')
    // TODO: This is strange behaviour - figure out why fold behaves this way
    assert.strictEqual(folder(undefined, []), undefined)
    assert.strictEqual(folder(null, []), null)
  })
  it('foldBrandedNullable', () => {
    const createBrand = (value: NullableString): string | null | undefined => String(value)
    const folder = foldBrandedNullable(createBrand, '/')
    assert.strictEqual(folder('my', ['path']), 'my/path')
    assert.strictEqual(folder(null, ['path']), 'path')
    assert.strictEqual(folder('my', [null]), 'my')
    assert.strictEqual(folder(undefined, ['path']), 'path')
    assert.strictEqual(folder('my', [null]), 'my')
    assert.strictEqual(folder(null, [null]), '')
    assert.strictEqual(folder(undefined, [undefined]), '')
    // TODO: This is strange behaviour - figure out why fold behaves this way
    assert.strictEqual(folder(undefined, []), undefined)
    assert.strictEqual(folder(null, []), null)
  })
  it('mapNotNullable', () => {
    const mapFn = (v: string): number => v.length
    const mapper = mapNotNullable(mapFn)
    assert.strictEqual(mapper('one'), 3)
    assert.strictEqual(mapper('four'), 4)
    assert.strictEqual(mapper(''), 0)
    assert.strictEqual(mapper(null), undefined)
    assert.strictEqual(mapper(undefined), undefined)
  })
  it('mapNotNullablePair', () => {
    const mapFn = (a: string, b: number): string => a + String(b)
    const mapper = mapNotNullablePair(mapFn)
    assert.strictEqual(mapper('', 0), '0')
    assert.strictEqual(mapper('one', 1), 'one1')
    assert.strictEqual(mapper('one', null), undefined)
    assert.strictEqual(mapper(null, 1), undefined)
    assert.strictEqual(mapper(null, null), undefined)
    assert.strictEqual(mapper('one', undefined), undefined)
    assert.strictEqual(mapper(undefined, 1), undefined)
    assert.strictEqual(mapper(undefined, undefined), undefined)
  })
})
