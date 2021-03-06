/// <reference types="bn.js" />
import type { BN } from '@polkadot/util';
import type { Registry } from '../types';
import { Base } from '../codec/Base';
import { GenericAccountId } from './AccountId';
import { GenericAccountIndex } from './AccountIndex';
declare type AnyAddress = bigint | BN | GenericLookupSource | GenericAccountId | GenericAccountIndex | number[] | Uint8Array | number | string;
export declare const ACCOUNT_ID_PREFIX: Uint8Array;
/**
 * @name LookupSource
 * @description
 * A wrapper around an AccountId and/or AccountIndex that is encoded with a prefix.
 * Since we are dealing with underlying publicKeys (or shorter encoded addresses),
 * we extend from Base with an AccountId/AccountIndex wrapper. Basically the Address
 * is encoded as `[ <prefix-byte>, ...publicKey/...bytes ]` as per spec
 */
export declare class GenericLookupSource extends Base<GenericAccountId | GenericAccountIndex> {
    constructor(registry: Registry, value?: AnyAddress);
    /** @internal */
    private static _decodeAddress;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description The length of the raw value, either AccountIndex or AccountId
     */
    protected get _rawLength(): number;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(): string;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
export {};
