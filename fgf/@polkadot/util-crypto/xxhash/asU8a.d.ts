/// <reference types="node" />
import type { HexString } from '@polkadot/util/types';
/**
 * @name xxhashAsU8a
 * @summary Creates a xxhash64 u8a from the input.
 * @description
 * From either a `string`, `Uint8Array` or a `Buffer` input, create the xxhash64 and return the result as a `Uint8Array` with the specified `bitLength`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { xxhashAsU8a } from '@polkadot/util-crypto';
 *
 * xxhashAsU8a('abc'); // => 0x44bc2cf5ad770999
 * ```
 */
export declare function xxhashAsU8a(data: HexString | Buffer | Uint8Array | string, bitLength?: number, onlyJs?: boolean): Uint8Array;
/**
 * @name xxhashAsHex
 * @description Creates a xxhash64 hex from the input.
 */
export declare const xxhashAsHex: (data: string | Buffer | Uint8Array, bitLength?: number | undefined, onlyJs?: boolean | undefined) => `0x${string}`;
