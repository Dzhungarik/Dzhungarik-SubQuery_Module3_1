// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert } from '@polkadot/util';
import { DeriveJunction } from "./DeriveJunction.js";
const RE_JUNCTION = /\/(\/?)([^/]+)/g;

/**
 * @description Extract derivation junctions from the supplied path
 */
export function keyExtractPath(derivePath) {
  const parts = derivePath.match(RE_JUNCTION);
  const path = [];
  let constructed = '';

  if (parts) {
    constructed = parts.join('');

    for (const p of parts) {
      path.push(DeriveJunction.from(p.substr(1)));
    }
  }

  assert(constructed === derivePath, () => `Re-constructed path "${constructed}" does not match input`);
  return {
    parts,
    path
  };
}