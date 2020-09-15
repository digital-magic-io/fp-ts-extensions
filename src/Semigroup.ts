import { Semigroup } from 'fp-ts/Semigroup'
import { isNonArrayObject, isNotEmptyString, NullableString } from '@digital-magic/ts-common-utils/lib/type'

export type NullableStringSemigroup = Semigroup<NullableString>

/**
 * Builds Semigroup that joins nullable strings with delimeter skipping elements that doesn't have value
 * @param delimiter
 */
export function getNullableStringSemigroup(delimiter: string): NullableStringSemigroup {
  return {
    concat: (x, y) => [x, y].filter(isNotEmptyString).join(delimiter)
  }
}

export function getBrandedNullableSemigroup<T>(
  createBrand: (value: NullableString) => T,
  delimiter: string
): Semigroup<T> {
  return {
    concat: (x, y) => createBrand([x, y].filter(isNotEmptyString).join(delimiter))
  }
}

/**
 * Recursively joins objects concatenating arrays if found.
 */
export function getDeepObjectSemigroup(): Semigroup<any> {
  return {
    concat: (x, y) => {
      if (Array.isArray(x) && Array.isArray(y)) {
        return x.concat(y)
      } else if (isNonArrayObject(x) && isNonArrayObject(y)) {
        const keys = new Set(Object.keys(x).concat(Object.keys(y)))
        const result: Record<string, any> = {}
        keys.forEach((key) => {
          if (x[key] === undefined) {
            result[key] = y[key]
          } else if (y[key] === undefined) {
            result[key] = x[key]
          } else {
            result[key] = getDeepObjectSemigroup().concat(x[key], y[key])
          }
        })
        return result
      } else {
        return Object.assign({}, x, y)
      }
    }
  }
}
