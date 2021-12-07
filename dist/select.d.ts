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
 * Reduce the code which written in initializer for mapping props
 * @param {Observable} observable
 * @param {Object|Array} getters
 * @return {Object}
 */
export declare function select<T>(store: T, map: ArrayMapping<T>): <Q extends Store = Store>(obj?: Q) => ArrayMappingResult<T> & Q;
export declare function select<T, P extends ObjectMapping<T>>(store: T, map: P): <Q extends Store = Store>(obj?: Q) => ObjectMappingResult<T, P> & Q;
export {};
