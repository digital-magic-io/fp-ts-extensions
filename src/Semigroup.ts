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

const asArray = (v: any) => (Array.isArray(v) ? v : isEmpty(v) ? [] : [v])

/**
 * Recursively joins objects concatenating arrays if found.
 */
export function getDeepObjectSemigroup(): Semigroup<any> {
  return {
    concat: (x, y) =>
      Array.isArray(x) || Array.isArray(y)
        ? A.getMonoid<any>().concat(asArray(x), asArray(y))
        : isNonArrayObject(x) && isNonArrayObject(y)
        ? pipe(
            A.union(eqString)(Object.keys(x), Object.keys(y)),
            A.map((k) => [k, getDeepObjectSemigroup().concat(x[k], y[k])] as ReadOnlyRecordTuple<string, any>),
            toReadonlyRecord
          )
        : (isEmpty(y) ? getFirstSemigroup<any>() : getLastSemigroup<any>()).concat(x, y)
  }
}
