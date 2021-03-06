"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pairs = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

// Copyright 2017-2021 @polkadot/keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0
var _map = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("map");

class Pairs {
  constructor() {
    Object.defineProperty(this, _map, {
      writable: true,
      value: {}
    });
  }

  add(pair) {
    (0, _classPrivateFieldLooseBase2.default)(this, _map)[_map][(0, _utilCrypto.decodeAddress)(pair.address).toString()] = pair;
    return pair;
  }

  all() {
    return Object.values((0, _classPrivateFieldLooseBase2.default)(this, _map)[_map]);
  }

  get(address) {
    const pair = (0, _classPrivateFieldLooseBase2.default)(this, _map)[_map][(0, _utilCrypto.decodeAddress)(address).toString()];

    (0, _util.assert)(pair, () => `Unable to retrieve keypair '${(0, _util.isU8a)(address) || (0, _util.isHex)(address) ? (0, _util.u8aToHex)((0, _util.u8aToU8a)(address)) : address}'`);
    return pair;
  }

  remove(address) {
    delete (0, _classPrivateFieldLooseBase2.default)(this, _map)[_map][(0, _utilCrypto.decodeAddress)(address).toString()];
  }

}

exports.Pairs = Pairs;