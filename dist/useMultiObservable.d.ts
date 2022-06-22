import { Store } from './useObservable';
/**
 *
 * @param stores
 * @returns
 * @category Hooks
 */
export declare function useMultiObservable<T extends Array<Store>>(...stores: T): T;
