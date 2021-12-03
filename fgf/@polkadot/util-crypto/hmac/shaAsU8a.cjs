"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmacSha512AsU8a = exports.hmacSha256AsU8a = void 0;
exports.hmacShaAsU8a = hmacShaAsU8a;

var _hash = _interopRequireDefault(require("hash.js"));

var _util = require("@polkadot/util");

var _wasmCrypto = require("@polkadot/wasm-crypto");

var _helpers = require("../helpers.cjs");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function createSha() {
  let bitLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;
  return (key, data, onlyJs) => hmacShaAsU8a(key, data, bitLength, onlyJs);
}

function hmacShaAsU8a(key, data) {
  let bitLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 256;
  let onlyJs = arguments.length > 3 ? arguments[3] : undefined;
  const is256 = bitLength === 256;
  const u8aKey = (0, _util.u8aToU8a)(key);
  return (0, _helpers.isWasmOnly)(onlyJs) ? is256 ? (0, _wasmCrypto.hmacSha256)(u8aKey, data) : (0, _wasmCrypto.hmacSha512)(u8aKey, data) : new Uint8Array(is256 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ? _hash.default.hmac(_hash.default.sha256, u8aKey).update(data).digest() // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  : _hash.default.hmac(_hash.default.sha512, u8aKey).update(data).digest());
}

const hmacSha256AsU8a = createSha(256);
exports.hmacSha256AsU8a = hmacSha256AsU8a;
const hmacSha512AsU8a = createSha(512);
exports.hmacSha512AsU8a = hmacSha512AsU8a;