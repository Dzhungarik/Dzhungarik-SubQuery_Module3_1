"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.u128 = void 0;

var _UInt = require("../codec/UInt.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name u128
 * @description
 * A 128-bit unsigned integer
 */
class u128 extends _UInt.UInt.with(128) {
  constructor(...args) {
    super(...args);
    this.__UIntType = 'u128';
  }

}

exports.u128 = u128;