// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert, bnToU8a, u8aConcat } from '@polkadot/util';
import { BN_BE_256_OPTS } from "../bn.js";
import { secp256k1Hasher } from "./hasher.js";
import { secp256k1 } from "./secp256k1.js";
/**
 * @name secp256k1Sign
 * @description Returns message signature of `message`, using the supplied pair
 */

export function secp256k1Sign(message, {
  secretKey
}, hashType = 'blake2') {
  assert((secretKey === null || secretKey === void 0 ? void 0 : secretKey.length) === 32, 'Expected valid secp256k1 secretKey, 32-bytes');
  const key = secp256k1.keyFromPrivate(secretKey);
  const ecsig = key.sign(secp256k1Hasher(hashType, message));
  return u8aConcat(bnToU8a(ecsig.r, BN_BE_256_OPTS), bnToU8a(ecsig.s, BN_BE_256_OPTS), new Uint8Array([ecsig.recoveryParam || 0]));
}