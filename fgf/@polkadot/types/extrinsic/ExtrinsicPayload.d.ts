import type { ExtrinsicPayloadV4 } from '../interfaces/extrinsics';
import type { Balance, Hash, Index } from '../interfaces/runtime';
import type { AnyJson, BareOpts, ExtrinsicPayloadValue, IKeyringPair, Registry } from '../types';
import { Base } from '../codec/Base';
import { Compact } from '../codec/Compact';
import { Raw } from '../codec/Raw';
import { u32 } from '../primitive/U32';
import { GenericExtrinsicEra } from './ExtrinsicEra';
interface ExtrinsicPayloadOptions {
    version?: number;
}
declare type ExtrinsicPayloadVx = ExtrinsicPayloadV4;
/**
 * @name GenericExtrinsicPayload
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the contents included
 */
export declare class GenericExtrinsicPayload extends Base<ExtrinsicPayloadVx> {
    constructor(registry: Registry, value?: Partial<ExtrinsicPayloadValue> | Uint8Array | string, { version }?: ExtrinsicPayloadOptions);
    /** @internal */
    static decodeExtrinsicPayload(registry: Registry, value?: GenericExtrinsicPayload | ExtrinsicPayloadValue | Uint8Array | string, version?: number): ExtrinsicPayloadVx;
    /**
     * @description The block [[Hash]] the signature applies to (mortal/immortal)
     */
    get blockHash(): Hash;
    /**
     * @description The [[ExtrinsicEra]]
     */
    get era(): GenericExtrinsicEra;
    /**
     * @description The genesis block [[Hash]] the signature applies to
     */
    get genesisHash(): Hash;
    /**
     * @description The [[Raw]] contained in the payload
     */
    get method(): Raw;
    /**
     * @description The [[Index]]
     */
    get nonce(): Compact<Index>;
    /**
     * @description The specVersion as a [[u32]] for this payload
     */
    get specVersion(): u32;
    /**
     * @description The [[Balance]]
     */
    get tip(): Compact<Balance>;
    /**
     * @description The transaction version as a [[u32]] for this payload
     */
    get transactionVersion(): u32;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Sign the payload with the keypair
     */
    sign(signerPair: IKeyringPair): {
        signature: string;
    };
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExtended?: boolean): AnyJson;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): any;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Returns a serialized u8a form
     */
    toU8a(isBare?: BareOpts): Uint8Array;
}
export {};
