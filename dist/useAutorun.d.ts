import { IReactionPublic } from 'mobx';
import { DependencyList } from 'react';
export declare function useAutorun(effect: (reaction?: IReactionPublic) => unknown, deps?: DependencyList): void;
