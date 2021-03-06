// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { isFunction, isHex, isString, isU8a, stringify, u8aConcat, u8aToU8a } from '@polkadot/util';
import { AbstractArray } from "./AbstractArray.js";
import { decodeU8a, mapToTypeMap, typeToConstructor } from "./utils/index.js";

/** @internal */
function decodeTuple(registry, _Types, value) {
  if (isU8a(value) || isHex(value)) {
    return decodeU8a(registry, u8aToU8a(value), _Types);
  }

  const Types = Array.isArray(_Types) ? _Types : Object.values(_Types);
  return Types.map((Type, index) => {
    try {
      const entry = value === null || value === void 0 ? void 0 : value[index];

      if (entry instanceof Type) {
        return entry;
      }

      return new Type(registry, entry);
    } catch (error) {
      throw new Error(`Tuple: failed on ${index}:: ${error.message}`);
    }
  });
}
/**
 * @name Tuple
 * @description
 * A Tuple defines an anonymous fixed-length array, where each element has its
 * own type. It extends the base JS `Array` object.
 */


export class Tuple extends AbstractArray {
  constructor(registry, Types, value) {
    const Clazzes = Array.isArray(Types) ? Types.map(t => typeToConstructor(registry, t)) : isFunction(Types) || isString(Types) ? [typeToConstructor(registry, Types)] : mapToTypeMap(registry, Types);
    super(registry, decodeTuple(registry, Clazzes, value));
    this._Types = void 0;
    this._Types = Clazzes;
  }

  static with(Types) {
    return class extends Tuple {
      constructor(registry, value) {
        super(registry, Types, value);
      }

    };
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return this.reduce((total, entry) => total + entry.encodedLength, 0);
  }
  /**
   * @description The types definition of the tuple
   */


  get Types() {
    return Array.isArray(this._Types) ? this._Types.map(Type => new Type(this.registry).toRawType()) : Object.keys(this._Types);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    const types = (Array.isArray(this._Types) ? this._Types : Object.values(this._Types)).map(Type => this.registry.getClassName(Type) || new Type(this.registry).toRawType());
    return `(${types.join(',')})`;
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    // Overwrite the default toString representation of Array.
    return stringify(this.toJSON());
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */


  toU8a(isBare) {
    return u8aConcat(...this.map(entry => entry.toU8a(isBare)));
  }

}