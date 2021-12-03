// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert, u8aToU8a } from '@polkadot/util';
import { sr25519Agree } from '@polkadot/wasm-crypto';
/**
 * @name schnorrkelAgreement
 * @description Key agreement between other's public key and self secret key
 */

export function schnorrkelAgreement(secretKey, publicKey) {
  const secretKeyU8a = u8aToU8a(secretKey);
  const publicKeyU8a = u8aToU8a(publicKey);
  assert(publicKeyU8a.length === 32, () => `Invalid publicKey, received ${publicKeyU8a.length} bytes, expected 32`);
  assert(secretKeyU8a.length === 64, () => `Invalid secretKey, received ${secretKeyU8a.length} bytes, expected 64`);
  return sr25519Agree(publicKeyU8a, secretKeyU8a);
}