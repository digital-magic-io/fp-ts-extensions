import * as R from 'fp-ts/lib/ReadonlyRecord'
import * as A from 'fp-ts/lib/ReadonlyArray'
import { getLastSemigroup } from 'fp-ts/Semigroup'

export type ReadOnlyRecordTuple<K extends string, V> = readonly [K, V]

/**
 * Converts array of ReadOnlyRecordTuple to Record.
 * @param arr ReadOnlyRecordTuple
 */
export const toReadonlyRecord = <K extends string, V>(arr: ReadonlyArray<ReadOnlyRecordTuple<K, V>>) =>
  R.fromFoldable(getLastSemigroup<V>(), A.readonlyArray)(arr)
