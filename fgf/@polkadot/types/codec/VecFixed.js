// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { assert, compactToU8a, isHex, isU8a, u8aConcat } from '@polkadot/util';
import { AbstractArray } from "./AbstractArray.js";
import { typeToConstructor } from "./utils/index.js";
import { Vec } from "./Vec.js";
/** @internal */

function decodeVecFixed(registry, Type, allocLength, value) {
  const values = Vec.decodeVec(registry, Type, isU8a(value) || isHex(value) ? u8aConcat(compactToU8a(allocLength), value) : value);

  while (values.length < allocLength) {
    values.push(new Type(registry));
  }

  assert(values.length === allocLength, () => `Expected a length of exactly ${allocLength} entries`);
  return values;
}
/**
 * @name VecFixed
 * @description
 * This manages codec arrays of a fixed length
 */


export class VecFixed extends AbstractArray {
  constructor(registry, Type, length, value = []) {
    const Clazz = typeToConstructor(registry, Type);
    super(registry, decodeVecFixed(registry, Clazz, length, value));
    this._Type = void 0;
    this._Type = Clazz;
  }

  static with(Type, length) {
    return class extends VecFixed {
      constructor(registry, value) {
        super(registry, Type, length, value);
      }

    };
  }
  /**
   * @description The type for the items
   */


  get Type() {
    return new this._Type(this.registry).toRawType();
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return this.reduce((total, entry) => total + entry.encodedLength, 0);
  }

  toU8a() {
    // we override, we don't add the length prefix for ourselves, and at the same time we
    // ignore isBare on entries, since they should be properly encoded at all times
    const encoded = this.map(entry => entry.toU8a());
    return encoded.length ? u8aConcat(...encoded) : new Uint8Array([]);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return `[${this.Type};${this.length}]`;
  }

}