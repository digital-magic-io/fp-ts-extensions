/*
export const mapValidation: <A, B>(f: (a: A) => B) => (v: Validation<A>) => Validation<B> = f => v => pipe(v, E.map(f))
export const chainValidations: <A, B>(f: (a: A) => Validation<B>) => (v: Validation<A>) => Validation<B> = f => v => pipe(v, E.chain(f))
*/
