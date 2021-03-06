"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RangeInclusive = exports.Range = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _Tuple = require("./Tuple.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
var _rangeName = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("rangeName");

/**
 * @name Range
 * @description
 * Rust `Range<T>` representation
 */
class Range extends _Tuple.Tuple {
  constructor(registry, Type, value, rangeName = 'Range') {
    super(registry, {
      end: Type,
      start: Type
    }, value);
    Object.defineProperty(this, _rangeName, {
      writable: true,
      value: void 0
    });
    (0, _classPrivateFieldLooseBase2.default)(this, _rangeName)[_rangeName] = rangeName;
  }

  static with(Types) {
    return class extends Range {
      constructor(registry, value) {
        super(registry, Types, value);
      }

    };
  }
  /**
   * @description Returns the starting range value
   */


  get start() {
    return this[0];
  }
  /**
   * @description Returns the ending range value
   */


  get end() {
    return this[1];
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return `${(0, _classPrivateFieldLooseBase2.default)(this, _rangeName)[_rangeName]}<${this.start.toRawType()}>`;
  }

}

exports.Range = Range;

class RangeInclusive extends Range {
  constructor(registry, type, value) {
    super(registry, type, value, 'RangeInclusive');
  }

  static with(Types) {
    return class extends RangeInclusive {
      constructor(registry, value) {
        super(registry, Types, value);
      }

    };
  }

}

exports.RangeInclusive = RangeInclusive;