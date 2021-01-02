import { Refinement } from 'fp-ts/function'
import { hasValue, OptionalType } from '@digital-magic/ts-common-utils/lib/type'
import { isSameOrAfterDay, isSameOrBeforeDay } from '@digital-magic/ts-common-utils/lib/date'

export type UnknownRefinement<T extends undefined> = Refinement<unknown, T>
export type StringRefinement<T extends string> = Refinement<string, T>
export type NumericRefinement<T extends number> = Refinement<number, T>
export type DateRefinement<T extends Date> = Refinement<Date, T>
export type ArrayBufferRefinement<T extends ArrayBuffer> = Refinement<unknown, T>

export const hasValueRefinement = <T extends unknown>(): Refinement<unknown | undefined, T> => (v): v is T =>
  hasValue(v)

type AnyArray = ReadonlyArray<any>

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
