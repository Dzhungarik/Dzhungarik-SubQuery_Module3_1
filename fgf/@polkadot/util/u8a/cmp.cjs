"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.u8aCmp = u8aCmp;

var _toU8a = require("./toU8a.cjs");

// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name u8aCmp
 * @summary Compares two Uint8Arrays for sorting.
 * @description
 * For `UInt8Array` (or hex string) input values returning -1, 0 or +1
 * @example
 * <BR>
 *
 * ```javascript
 * import { u8aCmp } from '@polkadot/util';
 *
 * u8aCmp(new Uint8Array([0x67, 0x65]), new Uint8Array([0x68, 0x65])); // -1
 * u8aCmp(new Uint8Array([0x68, 0x65]), new Uint8Array([0x68, 0x65])); // 0
 * u8aCmp(new Uint8Array([0x69, 0x65]), new Uint8Array([0x68, 0x65])); // +1
 * ```
 */
function u8aCmp(a, b) {
  const u8aa = (0, _toU8a.u8aToU8a)(a);
  const u8ab = (0, _toU8a.u8aToU8a)(b);
  let i = 0;

  while (true) {
    const overA = i >= u8aa.length;
    const overB = i >= u8ab.length;

    if (overA && overB) {
      // both ends reached
      return 0;
    } else if (overA) {
      // a has no more data, b has data
      return -1;
    } else if (overB) {
      // b has no more data, a has data
      return 1;
    } else if (u8aa[i] !== u8ab[i]) {
      // the number in this index doesn't match
      return u8aa[i] > u8ab[i] ? 1 : -1;
    }

    i++;
  }
}