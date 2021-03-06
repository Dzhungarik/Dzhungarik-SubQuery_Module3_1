// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { u8aToU8a } from '@polkadot/util';
import { twox } from '@polkadot/wasm-crypto';
import { createAsHex, isWasmOnly } from "../helpers.js";
import xxhash64AsBn from "./xxhash64/asBn.js";
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

export function xxhashAsU8a(data, bitLength = 64, onlyJs) {
  const iterations = Math.ceil(bitLength / 64);
  const u8a = u8aToU8a(data);

  if (isWasmOnly(onlyJs)) {
    return twox(u8a, iterations);
  }

  const result = new Uint8Array(Math.ceil(bitLength / 8));

  for (let seed = 0; seed < iterations; seed++) {
    result.set(xxhash64AsBn(u8a, seed).toArray('le', 8), seed * 8);
  }

  return result;
}
/**
 * @name xxhashAsHex
 * @description Creates a xxhash64 hex from the input.
 */

export const xxhashAsHex = createAsHex(xxhashAsU8a);