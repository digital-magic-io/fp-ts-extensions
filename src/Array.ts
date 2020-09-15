/**
 * Fold function definition for Array type.
 */
export type FoldFunction<T> = (a: T, as: ReadonlyArray<T>) => T

/**
 * Execute fold function using "Rest params".
 * @param f fold function
 */
export const foldCurried = <T>(f: FoldFunction<T>) => (a: T) => (...as: ReadonlyArray<T>): T => f(a, as)
