import type { Struct } from '@polkadot/types';
import type { Balance, BlockNumber } from '@polkadot/types/interfaces/runtime';
/** @name VestingInfo */
export interface VestingInfo extends Struct {
    readonly locked: Balance;
    readonly perBlock: Balance;
    readonly startingBlock: BlockNumber;
}
export declare type PHANTOM_VESTING = 'vesting';
