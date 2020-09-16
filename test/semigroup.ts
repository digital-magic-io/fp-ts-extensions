import * as assert from 'assert'
import * as R from 'fp-ts/lib/Record'
import { fold } from 'fp-ts/lib/Monoid'
import {
  getBrandedNullableSemigroup,
  getDeepObjectSemigroup,
  getNullableStringSemigroup,
  NullableStringSemigroup
} from '../src/Semigroup'
import { NullableString } from '@digital-magic/ts-common-utils/lib/type'

describe('semigroup', () => {
  it('getNullableStringSemigroup', () => {
    const nss: NullableStringSemigroup = getNullableStringSemigroup('/')
    assert.strictEqual(nss.concat('my', 'path'), 'my/path')
    assert.strictEqual(nss.concat(null, 'path'), 'path')
    assert.strictEqual(nss.concat('my', null), 'my')
    assert.strictEqual(nss.concat(undefined, 'path'), 'path')
    assert.strictEqual(nss.concat('my', undefined), 'my')
    assert.strictEqual(nss.concat(null, null), '')
    assert.strictEqual(nss.concat(undefined, undefined), '')
  })
  it('getBrandedNullableSemigroup', () => {
    const createBrand = (value: NullableString): string | null | undefined => String(value)
    const bns = getBrandedNullableSemigroup(createBrand, '/')
    assert.strictEqual(bns.concat('my', 'path'), 'my/path')
    assert.strictEqual(bns.concat(null, 'path'), 'path')
    assert.strictEqual(bns.concat('my', null), 'my')
    assert.strictEqual(bns.concat(undefined, 'path'), 'path')
    assert.strictEqual(bns.concat('my', null), 'my')
    assert.strictEqual(bns.concat(null, null), '')
    assert.strictEqual(bns.concat(undefined, undefined), '')
  })
  it('getDeepObjectSemigroup', () => {
    const obj1 = {
      name: 'Vasja',
      groups: [1, 2],
      age: 5,
      notes: 'Has a dog',
      children: [
        {
          name: 'Ivan'
        },
        {
          name: 'Vasja'
        }
      ],
      education: {
        type: 'higher',
        finished: 2000
      },
      hobby: {
        type: 'sports',
        title: 'Football'
      }
    }
    const obj2 = {
      name: 'Sanja',
      groups: [3],
      age: 15,
      extraInfo: 'Some info',
      children: [
        {
          name: 'Ira'
        }
      ],
      education: {
        type: 'master',
        finished: undefined,
        requiredAP: 180
      },
      pets: [
        {
          type: 'dog'
        }
      ],
      workplace: {
        name: 'Some workplace'
      },
      hobby: [
        {
          type: 'gaming',
          title: 'Strategies'
        }
      ]
    }
    const obj3 = {
      name: 'Sanja',
      groups: [1, 2, 3],
      age: 15,
      notes: 'Has a dog',
      children: [
        {
          name: 'Ivan'
        },
        {
          name: 'Vasja'
        },
        {
          name: 'Ira'
        }
      ],
      education: {
        type: 'master',
        finished: 2000,
        requiredAP: 180
      },
      hobby: [
        {
          type: 'gaming',
          title: 'Strategies'
        },
        {
          type: 'sports',
          title: 'Football'
        }
      ],
      extraInfo: 'Some info',
      pets: [
        {
          type: 'dog'
        }
      ],
      workplace: {
        name: 'Some workplace'
      }
    }
    const foldObjects = fold(R.getMonoid(getDeepObjectSemigroup()))
    // assert.strictEqual(foldObjects([obj1, obj2]), obj3)
    assert.strictEqual(JSON.stringify(foldObjects([obj1, obj2])), JSON.stringify(obj3))
  })
})
