/// <reference types="node" />
import type { HexString } from '@polkadot/util/types';
/**
 * @name keccakAsU8a
 * @summary Creates a keccak Uint8Array from the input.
 * @description
 * From either a `string` or a `Buffer` input, create the keccak and return the result as a `Uint8Array`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { keccakAsU8a } from '@polkadot/util-crypto';
 *
 * keccakAsU8a('123'); // => Uint8Array
 * ```
 */
export declare function keccakAsU8a(value: HexString | Buffer | Uint8Array | string, bitLength?: 256 | 512, onlyJs?: boolean): Uint8Array;
/**
 * @name keccak256AsU8a
 * @description Creates a keccak256 Uint8Array from the input.
 */
export declare const keccak256AsU8a: (data: string | Buffer | Uint8Array, onlyJs?: boolean | undefined) => Uint8Array;
/**
 * @name keccak512AsU8a
 * @description Creates a keccak512 Uint8Array from the input.
 */
export declare const keccak512AsU8a: (data: string | Buffer | Uint8Array, onlyJs?: boolean | undefined) => Uint8Array;
/**
 * @name keccakAsHex
 * @description Creates a keccak hex string from the input.
 */
export declare const keccakAsHex: (value: string | Buffer | Uint8Array, bitLength?: 256 | 512 | undefined, onlyJs?: boolean | undefined) => `0x${string}`;
