import type { Struct, Vec, u32 } from '@polkadot/types';
import type { AccountId, Balance, BlockNumber } from '@polkadot/types/interfaces/runtime';
/** @name Multisig */
export interface Multisig extends Struct {
    readonly when: Timepoint;
    readonly deposit: Balance;
    readonly depositor: AccountId;
    readonly approvals: Vec<AccountId>;
}
/** @name Timepoint */
export interface Timepoint extends Struct {
    readonly height: BlockNumber;
    readonly index: u32;
}
export declare type PHANTOM_UTILITY = 'utility';
