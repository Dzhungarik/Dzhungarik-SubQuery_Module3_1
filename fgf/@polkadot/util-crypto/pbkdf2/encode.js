// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { u8aToU8a } from '@polkadot/util';
import { pbkdf2 } from '@polkadot/wasm-crypto';
import { isWasmOnly } from "../helpers.js";
import { randomAsU8a } from "../random/asU8a.js";
import { pbkdf2Sync } from "./pbkdf2.js";
export function pbkdf2Encode(passphrase, salt = randomAsU8a(), rounds = 2048, onlyJs) {
  const u8aPass = u8aToU8a(passphrase);
  const u8aSalt = u8aToU8a(salt);
  return {
    password: isWasmOnly(onlyJs) ? pbkdf2(u8aPass, u8aSalt, rounds) : pbkdf2Sync(u8aPass, u8aSalt, rounds),
    rounds,
    salt
  };
}