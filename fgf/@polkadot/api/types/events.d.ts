import type { IsEvent } from '@polkadot/types/metadata/decorate/types';
import type { AnyTuple } from '@polkadot/types/types';
import type { ApiTypes } from './base';
export interface AugmentedEvents<ApiType extends ApiTypes> {
}
export declare type AugmentedEvent<ApiType extends ApiTypes, T extends AnyTuple = AnyTuple> = IsEvent<T>;
export interface ModuleEvents<ApiType extends ApiTypes> {
    [key: string]: AugmentedEvent<ApiType, AnyTuple>;
}
