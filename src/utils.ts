import * as O from 'fp-ts/lib/Option'
import { fold } from 'fp-ts/Semigroup'
import { getBrandedNullableSemigroup, getNullableStringSemigroup } from './Semigroup'
import { isEmpty, NullableString, NullableType, OptionalType } from '@digital-magic/ts-common-utils/lib/type'
import { pipe } from 'fp-ts/pipeable'

/**
 * Joins nullable strings
 * @param delimiter
 */
export const foldNullableString = (delimiter: string) => fold(getNullableStringSemigroup(delimiter))

/**
 * Joins nullable branded types
 * @param createBrand
 * @param delimiter
 */
// TODO: value can be not only of String type - need more generic solution
export const foldBrandedNullable = <T>(createBrand: (value: NullableString) => T, delimiter: string) =>
  fold(getBrandedNullableSemigroup(createBrand, delimiter))

export const mapNotNullable: <A, B>(f: (a: A) => B) => (v: OptionalType<A>) => OptionalType<B> = (f) => (v) =>
  pipe(O.fromNullable(v), O.map(f), O.toUndefined)

// TODO: Find better algebra
export const mapNotNullablePair = <A, B, C>(f: (a: A, b: B) => NullableType<C>) => (
  a: NullableType<A>,
  b: NullableType<B>
): NullableType<C> => (isEmpty(a) || isEmpty(b) ? undefined : f(a, b))

/*
export const mapValidation: <A, B>(f: (a: A) => B) => (v: Validation<A>) => Validation<B> = f => v => pipe(v, E.map(f))
export const chainValidations: <A, B>(f: (a: A) => Validation<B>) => (v: Validation<A>) => Validation<B> = f => v => pipe(v, E.chain(f))
*/
