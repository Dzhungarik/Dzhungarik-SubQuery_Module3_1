import type { Codec, Constructor, Registry } from '../../types';
/**
 * Given an u8a, and an array of Type constructors, decode the u8a against the
 * types, and return an array of decoded values.
 *
 * @param u8a - The u8a to decode.
 * @param types - The array of Constructor to decode the U8a against.
 */
export declare function decodeU8a(registry: Registry, u8a: Uint8Array, _types: Constructor[] | {
    [index: string]: Constructor;
}, _keys?: string[]): Codec[];
