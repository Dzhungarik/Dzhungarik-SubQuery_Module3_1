import type { Struct, u64 } from '@polkadot/types';
/** @name RawAuraPreDigest */
export interface RawAuraPreDigest extends Struct {
    readonly slotNumber: u64;
}
export declare type PHANTOM_AURA = 'aura';
