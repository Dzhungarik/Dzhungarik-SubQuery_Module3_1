"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSeedDeriveFn = createSeedDeriveFn;

var _util = require("@polkadot/util");

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
function createSeedDeriveFn(fromSeed, derive) {
  return (keypair, _ref) => {
    let {
      chainCode,
      isHard
    } = _ref;
    (0, _util.assert)(isHard, 'A soft key was found in the path and is not supported');
    return fromSeed(derive(keypair.secretKey.subarray(0, 32), chainCode));
  };
}