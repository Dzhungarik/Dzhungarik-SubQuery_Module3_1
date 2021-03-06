// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import hash from 'hash.js';
import { u8aToU8a } from '@polkadot/util';
import { sha256, sha512 } from '@polkadot/wasm-crypto';
import { createBitHasher, isWasmOnly } from "../helpers.js";
/**
 * @name shaAsU8a
 * @summary Creates a sha Uint8Array from the input.
 */

export function shaAsU8a(value, bitLength = 256, onlyJs) {
  const is256 = bitLength === 256;
  const u8a = u8aToU8a(value);
  return isWasmOnly(onlyJs) ? is256 ? sha256(u8a) : sha512(u8a) : new Uint8Array(is256 ? hash.sha256().update(u8a).digest() : hash.sha512().update(u8a).digest());
}
export const sha256AsU8a = createBitHasher(256, shaAsU8a);
export const sha512AsU8a = createBitHasher(512, shaAsU8a);