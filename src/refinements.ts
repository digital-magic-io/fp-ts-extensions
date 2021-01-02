import { Refinement } from 'fp-ts/function'
import { hasValue } from '@digital-magic/ts-common-utils/lib/type'
import { isSameOrAfterDay, isSameOrBeforeDay } from '@digital-magic/ts-common-utils/lib/date'

export type UnknownRefinement<T extends undefined> = Refinement<unknown, T>
export type StringRefinement<T extends string> = Refinement<string, T>
export type NumericRefinement<T extends number> = Refinement<number, T>
export type DateRefinement<T extends Date> = Refinement<Date, T>
export type ArrayBufferRefinement<T extends ArrayBuffer> = Refinement<unknown, T>

export function hasValueRefinement<T extends unknown>(): Refinement<unknown | undefined, T> {
  return (v): v is T => hasValue(v)
}

export function nonEmptyDistinctArrayRefinement<T extends ReadonlyArray<any>>(): Refinement<
  ReadonlyArray<any> | undefined,
  T
> {
  return (v): v is T => v?.length !== 0 && Array.from(new Set(v)).length === v?.length
}

export function nonEmptyOptionalStringRefinement<T extends string>(): Refinement<string | undefined, T> {
  return (v): v is T => hasValue(v) && v.length > 0
}

export function stringLengthRefinement<T extends string>(min: number, max: number): StringRefinement<T> {
  return (v): v is T => v.length >= min && v.length <= max
}

export function regexRefinement<T extends string>(regex: RegExp): StringRefinement<T> {
  return (v): v is T => regex.test(v)
}

export function inRangeRefinement<T extends number>(min: number, max: number): NumericRefinement<T> {
  return (v): v is T => v >= min && v <= max
}

export function dateInPastRefinement<T extends Date>(): DateRefinement<T> {
  return (v): v is T => !isSameOrAfterDay(v)
}

export function dateInFutureRefinement<T extends Date>(): DateRefinement<T> {
  return (v): v is T => !isSameOrBeforeDay(v)
}
