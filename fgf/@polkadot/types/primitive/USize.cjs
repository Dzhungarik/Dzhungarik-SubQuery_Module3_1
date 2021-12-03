"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usize = void 0;

var _U = require("./U32.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name USize
 * @description
 * A System default unsigned number, typically used in RPC to report non-consensus
 * data. It is a wrapper for [[U32]] as a WASM default (as generated by Rust bindings).
 * It is not to be used, since it created consensus mismatches.
 */
class usize extends _U.u32 {
  constructor(registry, value) {
    super(registry, value);
    throw new Error('The `usize` type should not be used. Since it is platform-specific, it creates incompatibilities between native (generally u64) and WASM (always u32) code. Use one of the `u32` or `u64` types explicitly.');
  }

}

exports.usize = usize;