import { IWhenOptions } from 'mobx';
import { DependencyList } from 'react';
/**
 * A helper hook. See [mobx#when](https://mobx.js.org/api.html#when) for more information.
 *
 * @param predicate
 * @param effect
 * @param deps
 * @param options
 * @category Hooks
 */
export declare function useWhen(predicate: () => boolean, effect?: () => unknown, deps?: DependencyList, options?: IWhenOptions): void;
