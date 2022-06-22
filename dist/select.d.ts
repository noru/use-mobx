import { Store } from './useObservable';
declare type ArrayMapping<T> = (keyof T)[];
declare type ArrayMappingResult<T> = {
    [key in keyof T]: T[key];
};
declare type ObjectMapping<T> = Record<string, keyof T>;
declare type ObjectMappingResult<T, P extends ObjectMapping<T>> = {
    [key in keyof P]: T[P[key]];
};
/**
 * Often time, only a few properties are needed to be watched by the component, and being reactive to the a large observable may causes performance impact.
 * In this case, you can either write your own initializer to reduce the watched properties, or use `select` to save some hassle.
 *
 * Example:
 * ```typescript
 *
 * let { bastards: { Jon, Ramsay } } = useObservable(select(northFamilies, ['bastards']))
 * // or equivalent
 * let { northBastards: { Jon, Ramsay } } =
 *   useObservable(select(northFamilies, { bastards: 'northBastards' }))
 *
 * ```
 *
 * @param {Observable} observable
 * @param {Object|Array} getters
 * @return {Object}
 * @category Helpers
 */
export declare function select<T>(store: T, map: ArrayMapping<T>): <Q extends Store = Store>(obj?: Q) => ArrayMappingResult<T> & Q;
export declare function select<T, P extends ObjectMapping<T>>(store: T, map: P): <Q extends Store = Store>(obj?: Q) => ObjectMappingResult<T, P> & Q;
export {};
