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
 * @param {Observable} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
export declare function mapProps<T>(store: T, map: ArrayMapping<T>): ArrayMappingResult<T>;
export declare function mapProps<T, P extends ObjectMapping<T>>(store: T, map: P): ObjectMappingResult<T, P>;
export {};
