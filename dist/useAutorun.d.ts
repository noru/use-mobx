import { IAutorunOptions, IReactionPublic } from 'mobx';
import { DependencyList } from 'react';
declare type Effect = (reaction?: IReactionPublic) => unknown;
/**
 * A helper hook. See [mobx#autorun](https://mobx.js.org/api.html#autorun) for more information.
 * @param effect
 * @param deps
 * @param options
 * @category Hooks
 */
export declare function useAutorun(effect: Effect, deps?: DependencyList, options?: IAutorunOptions): void;
export {};
