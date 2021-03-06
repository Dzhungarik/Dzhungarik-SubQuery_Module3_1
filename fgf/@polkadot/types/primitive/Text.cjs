"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _util = require("@polkadot/util");

var _Raw = require("../codec/Raw.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
const MAX_LENGTH = 128 * 1024;
/** @internal */

function decodeText(value) {
  if ((0, _util.isHex)(value)) {
    return (0, _util.u8aToString)((0, _util.hexToU8a)(value));
  } else if (value instanceof Uint8Array) {
    if (!value.length) {
      return '';
    } // for Raw, the internal buffer does not have an internal length
    // (the same applies in e.g. Bytes, where length is added at encoding-time)


    if (value instanceof _Raw.Raw) {
      return (0, _util.u8aToString)(value);
    }

    const [offset, length] = (0, _util.compactFromU8a)(value);
    const total = offset + length.toNumber();
    (0, _util.assert)(length.lten(MAX_LENGTH), () => `Text: length ${length.toString()} exceeds ${MAX_LENGTH}`);
    (0, _util.assert)(total <= value.length, () => `Text: required length less than remainder, expected at least ${total}, found ${value.length}`);
    return (0, _util.u8aToString)(value.subarray(offset, total));
  }

  return value ? value.toString() : '';
}
/**
 * @name Text
 * @description
 * This is a string wrapper, along with the length. It is used both for strings as well
 * as items such as documentation. It simply extends the standard JS `String` built-in
 * object, inheriting all methods exposed from `String`.
 * @noInheritDoc
 */
// TODO
//   - Strings should probably be trimmed (docs do come through with extra padding)


var _override = /*#__PURE__*/(0, _classPrivateFieldLooseKey2.default)("override");

class Text extends String {
  constructor(registry, value) {
    super(decodeText(value));
    this.registry = void 0;
    this.createdAtHash = void 0;
    Object.defineProperty(this, _override, {
      writable: true,
      value: null
    });
    this.registry = registry;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return this.toU8a().length;
  }
  /**
   * @description returns a hash of the contents
   */


  get hash() {
    return this.registry.hash(this.toU8a());
  }
  /**
   * @description Checks if the value is an empty value
   */


  get isEmpty() {
    return this.length === 0;
  }
  /**
   * @description The length of the value
   */


  get length() {
    // only included here since we ignore inherited docs
    return super.length;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return (0, _util.isString)(other) ? this.toString() === other.toString() : false;
  }
  /**
   * @description Set an override value for this
   */


  setOverride(override) {
    (0, _classPrivateFieldLooseBase2.default)(this, _override)[_override] = override;
  }
  /**
   * @description Returns a hex string representation of the value
   */


  toHex() {
    // like with Vec<u8>, when we are encoding to hex, we don't actually add
    // the length prefix (it is already implied by the actual string length)
    return (0, _util.u8aToHex)(this.toU8a(true));
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman() {
    return this.toJSON();
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    return this.toString();
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'Text';
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _override)[_override] || super.toString();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */


  toU8a(isBare) {
    // NOTE Here we use the super toString (we are not taking overrides into account,
    // rather encoding the original value the string was constructed with)
    const encoded = (0, _util.stringToU8a)(super.toString());
    return isBare ? encoded : (0, _util.compactAddLength)(encoded);
  }

}

exports.Text = Text;