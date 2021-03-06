import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";
// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { compactFromU8a, compactToU8a, isBigInt, isBn, isNumber, isString } from '@polkadot/util';
import { typeToConstructor } from "./utils/index.js";
/**
 * @name Compact
 * @description
 * A compact length-encoding codec wrapper. It performs the same function as Length, however
 * differs in that it uses a variable number of bytes to do the actual encoding. This is mostly
 * used by other types to add length-prefixed encoding, or in the case of wrapped types, taking
 * a number and making the compact representation thereof
 */

var _Type = /*#__PURE__*/_classPrivateFieldLooseKey("Type");

var _raw = /*#__PURE__*/_classPrivateFieldLooseKey("raw");

export class Compact {
  constructor(registry, Type, value = 0) {
    this.registry = void 0;
    this.createdAtHash = void 0;
    Object.defineProperty(this, _Type, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _raw, {
      writable: true,
      value: void 0
    });
    this.registry = registry;
    _classPrivateFieldLooseBase(this, _Type)[_Type] = typeToConstructor(registry, Type);
    _classPrivateFieldLooseBase(this, _raw)[_raw] = Compact.decodeCompact(registry, _classPrivateFieldLooseBase(this, _Type)[_Type], value);
  }

  static with(Type) {
    return class extends Compact {
      constructor(registry, value) {
        super(registry, Type, value);
      }

    };
  }
  /** @internal */


  static decodeCompact(registry, Type, value) {
    if (value instanceof Compact) {
      return new Type(registry, _classPrivateFieldLooseBase(value, _raw)[_raw]);
    } else if (isString(value) || isNumber(value) || isBn(value) || isBigInt(value)) {
      return new Type(registry, value);
    }

    return new Type(registry, compactFromU8a(value)[1]);
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
    return _classPrivateFieldLooseBase(this, _raw)[_raw].isEmpty;
  }
  /**
   * @description Returns the number of bits in the value
   */


  bitLength() {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].bitLength();
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].eq(other instanceof Compact ? _classPrivateFieldLooseBase(other, _raw)[_raw] : other);
  }
  /**
   * @description Returns a BigInt representation of the number
   */


  toBigInt() {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].toBigInt();
  }
  /**
   * @description Returns the BN representation of the number
   */


  toBn() {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].toBn();
  }
  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */


  toHex(isLe) {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].toHex(isLe);
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman(isExtended) {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].toHuman(isExtended);
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].toJSON();
  }
  /**
   * @description Returns the number representation for the value
   */


  toNumber() {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].toNumber();
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return `Compact<${this.registry.getClassName(_classPrivateFieldLooseBase(this, _Type)[_Type]) || _classPrivateFieldLooseBase(this, _raw)[_raw].toRawType()}>`;
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return _classPrivateFieldLooseBase(this, _raw)[_raw].toString();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  toU8a(isBare) {
    return compactToU8a(_classPrivateFieldLooseBase(this, _raw)[_raw].toBn());
  }
  /**
   * @description Returns the embedded [[UInt]] or [[Moment]] value
   */


  unwrap() {
    return _classPrivateFieldLooseBase(this, _raw)[_raw];
  }

}