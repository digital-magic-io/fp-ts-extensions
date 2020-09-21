import * as assert from 'assert'
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
      age: 15,
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
        finished: 2000,
        requiredAP: 180,
        type: 'master'
      },
      extraInfo: 'Some info',
      groups: [1, 2, 3],
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
      name: 'Sanja',
      notes: 'Has a dog',
      pets: [
        {
          type: 'dog'
        }
      ],
      workplace: {
        name: 'Some workplace'
      }
    }
    const concat = getDeepObjectSemigroup().concat
    assert.strictEqual(JSON.stringify(concat(obj1, obj2)), JSON.stringify(obj3))
  })
  it('getDeepObjectSemigroup must obey associative law', () => {
    const obj1 = {
      x: [1, 2, 3]
    }
    const obj2 = {
      x: 4
    }
    const obj3 = {
      x: [5, 6, 7]
    }
    const concat = getDeepObjectSemigroup().concat
    // associative law: (obj1 <> obj2) <> obj3 === obj1 <> (obj2 <> obj3)
    assert.strictEqual(
      JSON.stringify(concat(concat(obj1, obj2), obj3)),
      JSON.stringify(concat(obj1, concat(obj2, obj3)))
    )
  })
  it('getDeepObjectSemigroup must obey associative law with netsed structures', () => {
    const obj1 = {
      y: 1,
      x: {
        a: 1,
        b: 2,
        c: 3,
        d: [1, 2]
      },
      a: [
        {
          y: 6,
          x: 5
        }
      ]
    }
    const obj2 = {
      z: 1,
      x: {
        d: 3,
        e: 4,
        g: ['a', 'b', 'c', 'e', 'f', 'g', 'd']
      },
      a: [
        {
          y: 3,
          x: 4
        }
      ]
    }
    const obj3 = {
      x: {
        f: 5,
        d: [4, 5]
      },
      a: [
        {
          x: 1,
          y: 2
        }
      ]
    }
    const concat = getDeepObjectSemigroup().concat
    // associative law: (obj1 <> obj2) <> obj3 === obj1 <> (obj2 <> obj3)
    assert.strictEqual(
      JSON.stringify(concat(concat(obj1, obj2), obj3)),
      JSON.stringify(concat(obj1, concat(obj2, obj3)))
    )
    // tslint:disable-next-line:no-console
    const expected = {
      a: [
        {
          y: 6,
          x: 5
        },
        {
          y: 3,
          x: 4
        },
        {
          x: 1,
          y: 2
        }
      ],
      x: {
        a: 1,
        b: 2,
        c: 3,
        d: [1, 2, 3, 4, 5],
        e: 4,
        f: 5,
        g: ['a', 'b', 'c', 'd', 'e', 'f', 'g']
      },
      y: 1,
      z: 1
    }
    assert.strictEqual(JSON.stringify(concat(concat(obj1, obj2), obj3)), JSON.stringify(expected))
  })
})
