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
export declare function mapProps<T, Q = {}>(store: T, map: ArrayMapping<T>, toExtend?: Q): ArrayMappingResult<T> & Q;
export declare function mapProps<T, P extends ObjectMapping<T>, Q = {}>(store: T, map: P, toExtend?: Q): ObjectMappingResult<T, P> & Q;
export {};
