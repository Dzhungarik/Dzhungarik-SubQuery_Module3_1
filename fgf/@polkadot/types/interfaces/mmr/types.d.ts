import type { Bytes, Struct } from '@polkadot/types';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
/** @name MmrLeafProof */
export interface MmrLeafProof extends Struct {
    readonly blockHash: BlockHash;
    readonly leaf: Bytes;
    readonly proof: Bytes;
}
export declare type PHANTOM_MMR = 'mmr';
