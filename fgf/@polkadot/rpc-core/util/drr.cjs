"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drr = void 0;

var _rxjs = require("rxjs");

var _util = require("@polkadot/util");

var _refCountDelay = require("./refCountDelay.cjs");

// Copyright 2017-2021 @polkadot/rpc-core authors & contributors
// SPDX-License-Identifier: Apache-2.0
const l = (0, _util.logger)('drr');

const CMP = (a, b) => (0, _util.stringify)({
  t: a
}) === (0, _util.stringify)({
  t: b
});

const ERR = error => {
  l.error(error.message);
  throw error;
};

const NOOP = () => undefined;
/**
 * Shorthand for distinctUntilChanged(), publishReplay(1) and refCount().
 *
 * @ignore
 * @internal
 */


const drr = ({
  delay,
  skipChange = false,
  skipTimeout = false
} = {}) => source$ => source$.pipe((0, _rxjs.catchError)(ERR), skipChange ? (0, _rxjs.tap)(NOOP) : (0, _rxjs.distinctUntilChanged)(CMP), (0, _rxjs.publishReplay)(1), skipTimeout ? (0, _rxjs.refCount)() : (0, _refCountDelay.refCountDelay)(delay));

exports.drr = drr;