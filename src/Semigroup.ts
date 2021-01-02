import * as A from 'fp-ts/lib/ReadonlyArray'
import { fold as foldS, Semigroup } from 'fp-ts/lib/Semigroup'
import { ReadOnlyRecordTuple, toReadonlyRecord } from './ReadOnlyRecord'
import { eqString } from 'fp-ts/lib/Eq'
import { pipe } from 'fp-ts/lib/pipeable'
import {
  hasValue,
  isEmpty,
  isNonArrayObject,
  isNotEmptyString,
  NullableString,
  OptionalString
} from '@digital-magic/ts-common-utils/lib/type'

export type NullableStringSemigroup = Semigroup<NullableString>
export type OptionalStringSemigroup = Semigroup<OptionalString>

/**
 * Builds Semigroup that joins nullable strings with delimiter skipping elements that doesn't have value
 * @param delimiter
 */
export function getNullableStringSemigroup(delimiter: string): NullableStringSemigroup {
  return {
    concat: (x, y) => [x, y].filter(isNotEmptyString).join(delimiter)
  }
}

export function getOptionalStringSemigroup(delimeter: string): OptionalStringSemigroup {
  return {
    concat: (x, y) => [x, y].filter(isNotEmptyString).join(delimeter)
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

const mergeObjects = (x: any, y: any): any =>
  pipe(
    A.union(eqString)(Object.keys(x), Object.keys(y)),
    A.map((k) => [k, getDeepObjectSemigroup().concat(x[k], y[k])] as ReadOnlyRecordTuple<string, any>),
    toReadonlyRecord
  )

const mergeOther = (x: any, y: any): any =>
  isEmpty(y) ||
  (isNonArrayObject(y) && Array.isArray(x)) ||
  (hasValue(y) && typeof y !== 'object' && (Array.isArray(x) || isNonArrayObject(x)))
    ? x
    : y

/**
 * Recursively joins objects concatenating arrays if found.
 */
export function getDeepObjectSemigroup(): Semigroup<any> {
  return {
    concat: (x, y) =>
      Array.isArray(x) && Array.isArray(y)
        ? A.getMonoid<any>().concat(x, y)
        : isNonArrayObject(x) && isNonArrayObject(y)
        ? mergeObjects(x, y)
        : mergeOther(x, y)
  }
}

/**
 * Fold function with rest params.
 * @param S Semigroup
 */
export const fold = <A>(S: Semigroup<A>) => (startWith: A): ((...as: ReadonlyArray<A>) => A) => (...as) =>
  foldS(S)(startWith, as)

/**
 * Joins nullable strings array using separator.
 * @param delimiter
 */
export const foldOptionalString = (delimiter: string) => fold(getOptionalStringSemigroup(delimiter))

/**
 * Joins nullable branded strings array using separator.
 * @param createBrand
 * @param delimiter
 */
export const foldNullableBrandedString = <T>(createBrand: (v: NullableString) => T, delimiter: string) =>
  fold(getBrandedNullableSemigroup(createBrand, delimiter))
