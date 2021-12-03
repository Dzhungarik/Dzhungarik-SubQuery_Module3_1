// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { UInt } from "../codec/UInt.js";
/**
 * @name u8
 * @description
 * An 8-bit unsigned integer
 */

export class u8 extends UInt.with(8) {
  constructor(...args) {
    super(...args);
    this.__UIntType = 'u8';
  }

}