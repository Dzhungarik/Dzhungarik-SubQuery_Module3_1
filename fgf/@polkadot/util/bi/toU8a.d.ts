/// <reference types="bn.js" />
import type { BN } from '../bn/bn';
import type { ToBigInt, ToBn, ToBnOptions } from '../types';
interface Options extends ToBnOptions {
    bitLength?: number;
}
/**
 * @name biToU8a
 * @summary Creates a Uint8Array object from a bigint.
 */
export declare function biToU8a<ExtToBn extends ToBn | ToBigInt>(value?: ExtToBn | BN | bigint | number | null, options?: Options): Uint8Array;
export {};
