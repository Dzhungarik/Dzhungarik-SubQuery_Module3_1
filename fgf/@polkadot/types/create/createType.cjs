"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTypeUnsafe = createTypeUnsafe;
exports.createType = createType;

var _util = require("@polkadot/util");

var _Option = require("../codec/Option.cjs");

var _createClass = require("./createClass.cjs");

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// With isPedantic, actually check that the encoding matches that supplied. This
// is much slower, but verifies that we have the correct types defined
function checkInstance(created, matcher) {
  const u8a = created.toU8a();
  const rawType = created.toRawType();
  const isOk = // full match, all ok
  (0, _util.u8aEq)(u8a, matcher) || // on a length-prefixed type, just check the actual length
  ['Bytes', 'Text', 'Type'].includes(rawType) && matcher.length === created.length || // when the created is empty and matcher is also empty, let it slide...
  created.isEmpty && matcher.every(v => !v);
  (0, _util.assert)(isOk, () => `${rawType}:: Decoded input doesn't match input, received ${(0, _util.u8aToHex)(matcher, 512)} (${matcher.length} bytes), created ${(0, _util.u8aToHex)(u8a, 512)} (${u8a.length} bytes)`);
}

function checkPedantic(created, [value], isPedantic = false) {
  if (isPedantic) {
    if ((0, _util.isU8a)(value)) {
      checkInstance(created, value);
    } else if ((0, _util.isHex)(value)) {
      checkInstance(created, (0, _util.u8aToU8a)(value));
    }
  }
} // Initializes a type with a value. This also checks for fallbacks and in the cases
// where isPedantic is specified (storage decoding), also check the format/structure


function initType(registry, Type, params = [], {
  blockHash,
  isOptional,
  isPedantic
} = {}) {
  const created = new (isOptional ? _Option.Option.with(Type) : Type)(registry, ...params);
  checkPedantic(created, params, isPedantic);

  if (blockHash) {
    created.createdAtHash = createType(registry, 'Hash', blockHash);
  } // eslint-disable-next-line @typescript-eslint/no-unsafe-return


  return created;
} // An unsafe version of the `createType` below. It's unsafe because the `type`
// argument here can be any string, which, when it cannot parse, will yield a
// runtime error.


function createTypeUnsafe(registry, type, params = [], options = {}) {
  let Clazz = null;
  let firstError = null;

  try {
    Clazz = (0, _createClass.createClass)(registry, type);
    return initType(registry, Clazz, params, options);
  } catch (error) {
    firstError = new Error(`createType(${type}):: ${error.message}`);
  }

  if (Clazz && Clazz.__fallbackType) {
    try {
      Clazz = (0, _createClass.createClass)(registry, Clazz.__fallbackType);
      return initType(registry, Clazz, params, options);
    } catch {// swallow, we will throw the first error again
    }
  }

  throw firstError;
}
/**
 * Create an instance of a `type` with a given `params`.
 * @param type - A recognizable string representing the type to create an
 * instance from
 * @param params - The value to instantiate the type with
 */


function createType(registry, type, ...params) {
  return createTypeUnsafe(registry, type, params);
}