import * as A from 'fp-ts/lib/ReadonlyArray'
import { getFirstSemigroup, getLastSemigroup, Semigroup } from 'fp-ts/Semigroup'
import { ReadOnlyRecordTuple, toReadonlyRecord } from './ReadOnlyRecord'
import { eqString } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/pipeable'
import { isEmpty, isNonArrayObject, isNotEmptyString, NullableString } from '@digital-magic/ts-common-utils/lib/type'

export type NullableStringSemigroup = Semigroup<NullableString>

/**
 * Builds Semigroup that joins nullable strings with delimiter skipping elements that doesn't have value
 * @param delimiter
 */
export function getNullableStringSemigroup(delimiter: string): NullableStringSemigroup {
  return {
    concat: (x, y) => [x, y].filter(isNotEmptyString).join(delimiter)
  }
}

/**
 * Builds Semigroup that joins nullable branded strings with delimiter skipping elements that doesn't have value
 * @param createBrand brand constructor
 * @param delimiter
 */
export function getBrandedNullableSemigroup<T>(
  createBrand: (value: NullableString) => T,
  delimiter: string
): Semigroup<T> {
  return {
    concat: (x, y) => createBrand([x, y].filter(isNotEmptyString).join(delimiter))
  }
}

const arrConcat = A.getMonoid<any>().concat

const arrSmartConcat = <T>(x: ReadonlyArray<T> | T, y: ReadonlyArray<T> | T) =>
  arrConcat(Array.isArray(x) ? x : [x], Array.isArray(y) ? y : [y])

const buildRecordTuple = (key: string, x: any, y: any) => (s: Semigroup<any>): ReadOnlyRecordTuple<string, any> => [
  key,
  s.concat(x, y)
]

const mergeField = (x: Record<string, any>, y: Record<string, any>) => (
  key: string
): ReadOnlyRecordTuple<string, any> => {
  const brt = buildRecordTuple(key, x[key], y[key])
  switch ([isEmpty(x[key]), isEmpty(y[key])]) {
    case [true, false]:
      return brt(getFirstSemigroup<any>())
    case [false, true]:
      return brt(getLastSemigroup<any>())
    default:
      return brt(getDeepObjectSemigroup())
  }
}

/**
 * Recursively joins objects concatenating arrays if found.
 */
export function getDeepObjectSemigroup(): Semigroup<any> {
  return {
    concat: (x, y) => {
      if (Array.isArray(x) && Array.isArray(y)) {
        // tslint:disable-next-line:no-console
        console.log(x, y)
        const res = arrConcat(x, y)
        // tslint:disable-next-line:no-console
        console.log(res)
        return res
      } else if (Array.isArray(x) || Array.isArray(y)) {
        return Array.isArray(x) ? arrSmartConcat(x, y) : arrSmartConcat(y, x)
      } else if (isNonArrayObject(x) && isNonArrayObject(y)) {
        return pipe(
          A.uniq(eqString)(arrConcat(Object.keys(x), Object.keys(y))),
          // A.union(eqString)(Object.keys(x), Object.keys(y)),
          A.map(mergeField(x, y)),
          toReadonlyRecord
        )
      } else {
        return getLastSemigroup<any>().concat(x, y)
      }
    }
  }
}
