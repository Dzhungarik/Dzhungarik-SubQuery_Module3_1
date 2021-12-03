// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert } from "../assert.js";
import { hexToU8a } from "../hex/toU8a.js";
import { isBuffer } from "../is/buffer.js";
import { isHex } from "../is/hex.js";
import { isString } from "../is/string.js";
import { isU8a } from "../is/u8a.js";
import { stringToU8a } from "../string/toU8a.js";
/**
 * @name u8aToU8a
 * @summary Creates a Uint8Array value from a Uint8Array, Buffer, string or hex input.
 * @description
 * `null` or `undefined` inputs returns a `[]` result, Uint8Array values returns the value, hex strings returns a Uint8Array representation.
 * @example
 * <BR>
 *
 * ```javascript
 * import { u8aToU8a } from '@polkadot/util';
 *
 * u8aToU8a(new Uint8Array([0x12, 0x34]); // => Uint8Array([0x12, 0x34])
 * u8aToU8a(0x1234); // => Uint8Array([0x12, 0x34])
 * ```
 */

export function u8aToU8a(value) {
  if (!value) {
    return new Uint8Array();
  } else if (isHex(value)) {
    return hexToU8a(value);
  } else if (isString(value)) {
    return stringToU8a(value);
  } else if (Array.isArray(value) || isBuffer(value)) {
    return new Uint8Array(value);
  }

  assert(isU8a(value), () => `Unable to convert ${value.toString()} (typeof ${typeof value}) to a Uint8Array`);
  return value;
}