"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeriveJunction = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _util = require("@polkadot/util");

var _asU8a = require("../blake2/asU8a.cjs");

var _bn = require("../bn.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
const RE_NUMBER = /^\d+$/;
const JUNCTION_ID_LEN = 32;

var _chainCode = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("chainCode");

var _isHard = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("isHard");

class DeriveJunction {
  constructor() {
    Object.defineProperty(this, _chainCode, {
      writable: true,
      value: new Uint8Array(32)
    });
    Object.defineProperty(this, _isHard, {
      writable: true,
      value: false
    });
  }

  static from(value) {
    const result = new DeriveJunction();
    const [code, isHard] = value.startsWith('/') ? [value.substr(1), true] : [value, false];
    result.soft(RE_NUMBER.test(code) ? new _util.BN(code, 10) : code);
    return isHard ? result.harden() : result;
  }

  get chainCode() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _chainCode)[_chainCode];
  }

  get isHard() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _isHard)[_isHard];
  }

  get isSoft() {
    return !(0, _classPrivateFieldLooseBase2.default)(this, _isHard)[_isHard];
  }

  hard(value) {
    return this.soft(value).harden();
  }

  harden() {
    (0, _classPrivateFieldLooseBase2.default)(this, _isHard)[_isHard] = true;
    return this;
  }

  soft(value) {
    if ((0, _util.isNumber)(value) || (0, _util.isBn)(value) || (0, _util.isBigInt)(value)) {
      return this.soft((0, _util.bnToU8a)(value, _bn.BN_LE_256_OPTS));
    } else if ((0, _util.isHex)(value)) {
      return this.soft((0, _util.hexToU8a)(value));
    } else if ((0, _util.isString)(value)) {
      return this.soft((0, _util.compactAddLength)((0, _util.stringToU8a)(value)));
    } else if (value.length > JUNCTION_ID_LEN) {
      return this.soft((0, _asU8a.blake2AsU8a)(value));
    }

    (0, _classPrivateFieldLooseBase2.default)(this, _chainCode)[_chainCode].fill(0);

    (0, _classPrivateFieldLooseBase2.default)(this, _chainCode)[_chainCode].set(value, 0);

    return this;
  }

  soften() {
    (0, _classPrivateFieldLooseBase2.default)(this, _isHard)[_isHard] = false;
    return this;
  }

}

exports.DeriveJunction = DeriveJunction;