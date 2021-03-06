// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { u8aToHex } from '@polkadot/util';
import { isReady } from '@polkadot/wasm-crypto'; // eslint-disable-next-line @typescript-eslint/no-explicit-any

export function createAsHex(fn) {
  return (...args) => u8aToHex(fn(...args));
}
export function createBitHasher(bitLength, fn) {
  return (data, onlyJs) => fn(data, bitLength, onlyJs);
}
export function isWasmOnly(onlyJs) {
  return isReady() && !onlyJs;
}