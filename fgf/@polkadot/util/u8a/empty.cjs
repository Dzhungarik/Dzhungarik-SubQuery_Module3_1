"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.u8aEmpty = u8aEmpty;

// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name u8aEmpty
 * @summary Tests for a `Uint8Array` for emptyness
 * @description
 * Checks to see if the input `Uint8Array` has zero length or contains all 0 values.
 */
function u8aEmpty(value) {
  for (let i = 0; i < value.length; i++) {
    if (value[i]) {
      return false;
    }
  }

  return true;
}