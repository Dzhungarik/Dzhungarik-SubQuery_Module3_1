"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i16 = void 0;

var _Int = require("../codec/Int.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name i16
 * @description
 * A 16-bit signed integer
 */
class i16 extends _Int.Int.with(16) {
  constructor(...args) {
    super(...args);
    this.__IntType = 'i16';
  }

}

exports.i16 = i16;