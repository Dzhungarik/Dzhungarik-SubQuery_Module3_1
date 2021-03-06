"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Null = void 0;

var _util = require("@polkadot/util");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @name Null
 * @description
 * Implements a type that does not contain anything (apart from `null`)
 */
class Null {
  constructor(registry) {
    this.registry = void 0;
    this.createdAtHash = void 0;
    this.registry = registry;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return 0;
  }
  /**
   * @description returns a hash of the contents
   */


  get hash() {
    throw new Error('.hash is not implemented on Null');
  }
  /**
   * @description Checks if the value is an empty value (always true)
   */


  get isEmpty() {
    return true;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return other instanceof Null || (0, _util.isNull)(other);
  }
  /**
   * @description Returns a hex string representation of the value
   */


  toHex() {
    return '0x';
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
    return null;
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'Null';
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return '';
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  toU8a(isBare) {
    return new Uint8Array();
  }

}

exports.Null = Null;