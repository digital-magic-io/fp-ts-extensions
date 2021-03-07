import { Refinement } from 'fp-ts/function'
import { hasValue, NullableType, OptionalType } from '@digital-magic/ts-common-utils/lib/type'
import { isSameOrAfterDay, isSameOrBeforeDay } from '@digital-magic/ts-common-utils/lib/date'

export type UnknownRefinement<T extends undefined> = Refinement<unknown, T>
export type StringRefinement<T extends string> = Refinement<string, T>
export type NumericRefinement<T extends number> = Refinement<number, T>
export type DateRefinement<T extends Date> = Refinement<Date, T>
export type ArrayBufferRefinement<T extends ArrayBuffer> = Refinement<unknown, T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasValueRefinement = <T = NonNullable<any>>(): Refinement<NullableType<T>, T> => (v): v is T =>
  // eslint-disable-next-line
  hasValue(v) as boolean // This cast is unneeded but eslint has a problem to compile it without it

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArray = ReadonlyArray<any> // TODO: Maybe unknown?

const distinctArray = <T>(v: ReadonlyArray<T>): ReadonlyArray<T> => Array.from(new Set(v))

export const nonEmptyDistinctArrayRefinement = <T extends AnyArray>(): Refinement<OptionalType<AnyArray>, T> => (
  v
): v is T => hasValue(v) && v.length > 0 && distinctArray(v).length === v.length

export const nonEmptyOptionalStringRefinement = <T extends string>(): Refinement<string | undefined, T> => (
  v
): v is T => hasValue(v) && v.length > 0

export const stringLengthRefinement = <T extends string>(min: number, max: number): StringRefinement<T> => (
  v
): v is T => v.length >= min && v.length <= max

export const regexRefinement = <T extends string>(regex: RegExp): StringRefinement<T> => (v): v is T => regex.test(v)

export const inRangeRefinement = <T extends number>(min: number, max: number): NumericRefinement<T> => (v): v is T =>
  v >= min && v <= max

export const dateInPastRefinement = <T extends Date>(): DateRefinement<T> => (v): v is T => !isSameOrAfterDay(v)

export const dateInFutureRefinement = <T extends Date>(): DateRefinement<T> => (v): v is T => !isSameOrBeforeDay(v)
