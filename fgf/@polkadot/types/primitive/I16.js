// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { Int } from "../codec/Int.js";
/**
 * @name i16
 * @description
 * A 16-bit signed integer
 */

export class i16 extends Int.with(16) {
  constructor(...args) {
    super(...args);
    this.__IntType = 'i16';
  }

}