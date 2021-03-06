"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericMultiAddress = void 0;

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _Enum = require("../codec/Enum.cjs");

var _AccountId = require("./AccountId.cjs");

var _AccountIndex = require("./AccountIndex.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
function decodeU8a(registry, u8a) {
  if ([0, 32].includes(u8a.length)) {
    return {
      Id: u8a
    };
  } else if (u8a.length === 20) {
    return {
      Address20: u8a
    };
  } else if (u8a.length <= 8) {
    return {
      Index: registry.createType('AccountIndex', u8a).toNumber()
    };
  }

  return u8a;
}

function decodeMultiAny(registry, value) {
  if (value instanceof GenericMultiAddress) {
    return value;
  } else if (value instanceof _AccountId.GenericAccountId) {
    return {
      Id: value
    };
  } else if (value instanceof _AccountIndex.GenericAccountIndex || (0, _util.isBn)(value) || (0, _util.isNumber)(value)) {
    return {
      Index: (0, _util.isNumber)(value) ? value : value.toNumber()
    };
  } else if ((0, _util.isString)(value)) {
    return decodeU8a(registry, (0, _utilCrypto.decodeAddress)(value.toString()));
  } else if ((0, _util.isU8a)(value)) {
    return decodeU8a(registry, value);
  }

  return value;
}

class GenericMultiAddress extends _Enum.Enum {
  constructor(registry, value) {
    super(registry, {
      Id: 'AccountId',
      Index: 'Compact<AccountIndex>',
      Raw: 'Bytes',
      // eslint-disable-next-line sort-keys
      Address32: 'H256',
      // eslint-disable-next-line sort-keys
      Address20: 'H160'
    }, decodeMultiAny(registry, value));
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return this.value.toString();
  }

}

exports.GenericMultiAddress = GenericMultiAddress;