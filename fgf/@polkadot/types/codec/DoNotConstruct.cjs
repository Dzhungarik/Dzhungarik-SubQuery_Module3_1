"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DoNotConstruct = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _neverError = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("neverError");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name DoNotConstruct
 * @description
 * An unknown type that fails on construction with the type info
 */
class DoNotConstruct {
  constructor(registry, typeName = 'DoNotConstruct') {
    this.registry = void 0;
    this.createdAtHash = void 0;
    Object.defineProperty(this, _neverError, {
      writable: true,
      value: void 0
    });
    this.registry = registry;
    (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError] = new Error(`DoNotConstruct: Cannot construct unknown type ${typeName}`);
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

  static with(typeName) {
    return class extends DoNotConstruct {
      constructor(registry) {
        super(registry, typeName);
      }

    };
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }
  /**
   * @description returns a hash of the contents
   */


  get hash() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }
  /**
   * @description Checks if the value is an empty value (always true)
   */


  get isEmpty() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

  eq() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

  toHex() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

  toHuman() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

  toJSON() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

  toRawType() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

  toString() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

  toU8a() {
    throw (0, _classPrivateFieldLooseBase2.default)(this, _neverError)[_neverError];
  }

}

exports.DoNotConstruct = DoNotConstruct;