// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert, u8aEq, u8aToU8a } from '@polkadot/util';
import { secp256k1Expand } from "./expand.js";
import { secp256k1Hasher } from "./hasher.js";
import { secp256k1 } from "./secp256k1.js";
/**
 * @name secp256k1Verify
 * @description Verifies the signature of `message`, using the supplied pair
 */

export function secp256k1Verify(message, signature, address, hashType = 'blake2') {
  const isEthereum = hashType === 'keccak';
  const u8a = u8aToU8a(signature);
  assert(u8a.length === 65, `Expected signature with 65 bytes, ${u8a.length} found instead`);
  const publicKey = new Uint8Array( // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
  secp256k1.recoverPubKey(secp256k1Hasher(hashType, message), {
    r: u8a.slice(0, 32),
    s: u8a.slice(32, 64)
  }, u8a[64]).encodeCompressed());
  const signingAddress = secp256k1Hasher(hashType, isEthereum ? secp256k1Expand(publicKey) : publicKey);
  const inputAddress = u8aToU8a(address); // for Ethereum (keccak) the last 20 bytes is the address

  return isEthereum ? u8aEq(signingAddress.slice(-20), inputAddress.slice(-20)) : u8aEq(signingAddress, inputAddress);
}