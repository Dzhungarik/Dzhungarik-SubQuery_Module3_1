// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert } from "../assert.js";
import { BI_MAX_INTEGER } from "./consts.js";
import { biToBigInt } from "./toBigInt.js";
const SQRT_MAX_SAFE_INTEGER = 94906265n;
/**
 * @name biSqrt
 * @summary Calculates the integer square root of a bigint
 */

export function biSqrt(value) {
  const n = biToBigInt(value);
  assert(n >= 0n, 'square root of negative numbers is not supported'); // https://stackoverflow.com/questions/53683995/javascript-big-integer-square-root/
  // shortcut <= 2^53 - 1 to use the JS utils

  if (n <= BI_MAX_INTEGER) {
    return BigInt(Math.floor(Math.sqrt(Number(n))));
  } // Use sqrt(MAX_SAFE_INTEGER) as starting point. since we already know the
  // output will be larger than this, we expect this to be a safe start


  let x0 = SQRT_MAX_SAFE_INTEGER;

  while (true) {
    const x1 = n / x0 + x0 >> 1n;

    if (x0 === x1 || x0 === x1 - 1n) {
      return x0;
    }

    x0 = x1;
  }
}