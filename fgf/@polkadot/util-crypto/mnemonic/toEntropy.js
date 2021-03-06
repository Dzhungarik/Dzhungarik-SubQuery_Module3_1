// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { bip39ToEntropy } from '@polkadot/wasm-crypto';
import { isWasmOnly } from "../helpers.js";
import { mnemonicToEntropy as jsToEntropy } from "./bip39.js";
export function mnemonicToEntropy(mnemonic, onlyJs) {
  return isWasmOnly(onlyJs) ? bip39ToEntropy(mnemonic) : jsToEntropy(mnemonic);
}