import * as R from 'fp-ts/lib/ReadonlyRecord'
import * as A from 'fp-ts/lib/ReadonlyArray'
// import { pipe } from 'fp-ts/pipeable'
import { fromCompare, Ord } from 'fp-ts/Ord'
import { getLastSemigroup } from 'fp-ts/Semigroup'
// import { isNonArrayObject } from '@digital-magic/ts-common-utils/lib/type'

export type ReadOnlyRecordTuple<K extends string, V> = readonly [K, V]

/**
 * combinator that builds Ord instance for ReadOnlyRecordTuple based on Ord for keys.
 * @param keyOrd Ord instance
 */
export const getRecordPairOrd = <K extends string, V>(keyOrd: Ord<K>): Ord<ReadOnlyRecordTuple<K, V>> =>
  fromCompare(([k1, _v1]: ReadOnlyRecordTuple<K, V>, [k2, _v2]: ReadOnlyRecordTuple<K, V>) => keyOrd.compare(k1, k2))

/**
 * Converts array of ReadOnlyRecordTuple to Record.
 * @param arr ReadOnlyRecordTuple
 */
export const toReadonlyRecord = <K extends string, V>(arr: ReadonlyArray<ReadOnlyRecordTuple<K, V>>) =>
  R.fromFoldable(getLastSemigroup<V>(), A.readonlyArray)(arr)

/**
 * Sorts readonly record keys recursively.
 * @param r readonly record
 */
/*
export const sortRecursively = (r: R.ReadonlyRecord<string, any>): R.ReadonlyRecord<string, any> =>
  pipe(
    R.toReadonlyArray(r),
    A.sort(getRecordPairOrd(ordString)),
    toReadonlyRecord,
    R.map((v) => (isNonArrayObject(v) ? sortRecursively(v) : v))
  )
*/
