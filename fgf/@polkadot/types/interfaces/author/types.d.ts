import type { Bytes, Enum, Text, Vec } from '@polkadot/types';
import type { Hash } from '@polkadot/types/interfaces/runtime';
/** @name ExtrinsicOrHash */
export interface ExtrinsicOrHash extends Enum {
    readonly isHash: boolean;
    readonly asHash: Hash;
    readonly isExtrinsic: boolean;
    readonly asExtrinsic: Bytes;
}
/** @name ExtrinsicStatus */
export interface ExtrinsicStatus extends Enum {
    readonly isFuture: boolean;
    readonly isReady: boolean;
    readonly isBroadcast: boolean;
    readonly asBroadcast: Vec<Text>;
    readonly isInBlock: boolean;
    readonly asInBlock: Hash;
    readonly isRetracted: boolean;
    readonly asRetracted: Hash;
    readonly isFinalityTimeout: boolean;
    readonly asFinalityTimeout: Hash;
    readonly isFinalized: boolean;
    readonly asFinalized: Hash;
    readonly isUsurped: boolean;
    readonly asUsurped: Hash;
    readonly isDropped: boolean;
    readonly isInvalid: boolean;
}
export declare type PHANTOM_AUTHOR = 'author';
