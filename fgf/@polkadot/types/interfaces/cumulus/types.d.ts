import type { Struct, U8aFixed, u32, u64 } from '@polkadot/types';
import type { Weight } from '@polkadot/types/interfaces/runtime';
/** @name ConfigData */
export interface ConfigData extends Struct {
    readonly maxIndividual: Weight;
}
/** @name MessageId */
export interface MessageId extends U8aFixed {
}
/** @name OverweightIndex */
export interface OverweightIndex extends u64 {
}
/** @name PageCounter */
export interface PageCounter extends u32 {
}
/** @name PageIndexData */
export interface PageIndexData extends Struct {
    readonly beginUsed: PageCounter;
    readonly endUsed: PageCounter;
    readonly overweightCount: OverweightIndex;
}
export declare type PHANTOM_CUMULUS = 'cumulus';
