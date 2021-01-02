import * as assert from 'assert'
import {
  foldNullableBrandedString,
  foldOptionalString,
  getBrandedNullableSemigroup,
  getDeepObjectSemigroup,
  getNullableStringSemigroup,
  getOptionalStringSemigroup,
  NullableStringSemigroup,
  OptionalStringSemigroup
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
  it('getNullableStringSemigroup associativity law', () => {
    const concat = getNullableStringSemigroup('/').concat
    assert.strictEqual(concat(concat('my', 'path'), 'ends'), concat('my', concat('path', 'ends')))
    assert.strictEqual(concat(concat('my', null), 'ends'), concat('my', concat(null, 'ends')))
  })
  it('getOptionalStringSemigroup', () => {
    const nss: OptionalStringSemigroup = getOptionalStringSemigroup('/')
    assert.strictEqual(nss.concat('my', 'path'), 'my/path')
    assert.strictEqual(nss.concat(undefined, 'path'), 'path')
    assert.strictEqual(nss.concat('my', undefined), 'my')
    assert.strictEqual(nss.concat(undefined, undefined), '')
  })
  it('getOptionalStringSemigroup associativity law', () => {
    const concat = getNullableStringSemigroup('/').concat
    assert.strictEqual(concat(concat('my', 'path'), 'ends'), concat('my', concat('path', 'ends')))
    assert.strictEqual(concat(concat('my', undefined), 'ends'), concat('my', concat(undefined, 'ends')))
  })
  it('getBrandedNullableSemigroup', () => {
    const createBrand = (value: NullableString): string | null | undefined => String(value)
    const bns = getBrandedNullableSemigroup(createBrand, '/')
    assert.strictEqual(bns.concat('my', 'path'), 'my/path')
    assert.strictEqual(bns.concat('my', 'path'), 'my/path')
    assert.strictEqual(bns.concat(null, 'path'), 'path')
    assert.strictEqual(bns.concat('my', null), 'my')
    assert.strictEqual(bns.concat(undefined, 'path'), 'path')
    assert.strictEqual(bns.concat('my', null), 'my')
    assert.strictEqual(bns.concat(null, null), '')
    assert.strictEqual(bns.concat(undefined, undefined), '')
  })
  it('getBrandedNullableSemigroup associativity law', () => {
    const createBrand = (value: NullableString): string | null | undefined => String(value)
    const concat = getBrandedNullableSemigroup(createBrand, '/').concat
    assert.strictEqual(concat(concat('my', undefined), 'ends'), concat('my', concat(undefined, 'ends')))
  })
  it('getDeepObjectSemigroup must obey associative law with arrays', () => {
    const obj1: ReadonlyArray<any> = [1, 2, 3]
    const obj2: ReadonlyArray<any> = [4, 9]
    const obj3: ReadonlyArray<any> = [5, 6, 7]
    const concat = getDeepObjectSemigroup().concat
    assert.strictEqual(
      JSON.stringify(concat(concat(obj1, obj2), obj3)),
      JSON.stringify(concat(obj1, concat(obj2, obj3)))
    )
  })
  it('getDeepObjectSemigroup must obey associative law with mixture of objects and basic types', () => {
    const obj1 = {
      x: {
        a: 1
      }
    }
    const obj2 = {
      x: 'u'
    }
    const obj3 = {
      x: {
        b: 1
      }
    }
    const concat = getDeepObjectSemigroup().concat
    // associative law: (obj1 <> obj2) <> obj3 === obj1 <> (obj2 <> obj3)
    assert.strictEqual(
      JSON.stringify(concat(concat(obj1, obj2), obj3)),
      JSON.stringify(concat(obj1, concat(obj2, obj3)))
    )
  })
  it('getDeepObjectSemigroup must obey associative law with objects of array', () => {
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
  it('getDeepObjectSemigroup must obey associative law with objects of array2', () => {
    const obj1 = {
      x: [1]
    }
    const obj2 = {
      x: 1
    }
    const obj3 = {
      x: 2
    }
    const concat = getDeepObjectSemigroup().concat
    // associative law: (obj1 <> obj2) <> obj3 === obj1 <> (obj2 <> obj3)
    assert.strictEqual(
      JSON.stringify(concat(concat(obj1, obj2), obj3)),
      JSON.stringify(concat(obj1, concat(obj2, obj3)))
    )
  })
  it('getDeepObjectSemigroup must obey associative law with objects of array of objects', () => {
    const obj1 = {
      x: [{ x: 4 }]
    }
    const obj2 = {
      x: { x: 3 }
    }
    const obj3 = {
      x: [{ x: 2 }]
    }
    const concat = getDeepObjectSemigroup().concat

    // associative law: (obj1 <> obj2) <> obj3 === obj1 <> (obj2 <> obj3)
    assert.strictEqual(
      JSON.stringify(concat(concat(obj1, obj2), obj3)),
      JSON.stringify(concat(obj1, concat(obj2, obj3)))
    )
  })
  it('getDeepObjectSemigroup must obey associative law with nested structures', () => {
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
  })
  it('getDeepObjectSemigroup merges data correctly', () => {
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
      hobby: [
        {
          type: 'sports',
          title: 'Football'
        }
      ]
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
          type: 'sports',
          title: 'Football'
        },
        {
          type: 'gaming',
          title: 'Strategies'
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
    const concat = getDeepObjectSemigroup().concat
    assert.strictEqual(JSON.stringify(concat(obj1, obj2)), JSON.stringify(obj3))
  })
  it('foldOptionalString', () => {
    const folder = foldOptionalString('/')
    assert.strictEqual(folder('my')('path'), 'my/path')
    assert.strictEqual(folder('my')(undefined), 'my')
    assert.strictEqual(folder(undefined)('path'), 'path')
    assert.strictEqual(folder(undefined)(undefined), '')
    // TODO: This is strange behaviour - figure out why fold behaves this way
    assert.strictEqual(folder(undefined)(), undefined)
  })
  it('foldBrandedNullable', () => {
    const createBrand = (value: NullableString): string | null | undefined => String(value)
    const folder = foldNullableBrandedString(createBrand, '/')
    assert.strictEqual(folder('my')('path'), 'my/path')
    assert.strictEqual(folder(null)('path'), 'path')
    assert.strictEqual(folder('my')(null), 'my')
    assert.strictEqual(folder(undefined)('path'), 'path')
    assert.strictEqual(folder('my')(null), 'my')
    assert.strictEqual(folder(null)(null), '')
    assert.strictEqual(folder(undefined)(undefined), '')
    // TODO: This is strange behaviour - figure out why fold behaves this way
    assert.strictEqual(folder(undefined)(), undefined)
    assert.strictEqual(folder(null)(), null)
  })
})
