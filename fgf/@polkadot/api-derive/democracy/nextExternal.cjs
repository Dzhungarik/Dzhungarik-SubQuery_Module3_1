"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextExternal = nextExternal;

var _rxjs = require("rxjs");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
function withImage(api, nextOpt) {
  if (nextOpt.isNone) {
    return (0, _rxjs.of)(null);
  }

  const [imageHash, threshold] = nextOpt.unwrap();
  return api.derive.democracy.preimage(imageHash).pipe((0, _rxjs.map)(image => ({
    image,
    imageHash,
    threshold
  })));
}

function nextExternal(instanceId, api) {
  return (0, _index.memo)(instanceId, () => {
    var _api$query$democracy;

    return (_api$query$democracy = api.query.democracy) !== null && _api$query$democracy !== void 0 && _api$query$democracy.nextExternal ? api.query.democracy.nextExternal().pipe((0, _rxjs.switchMap)(nextOpt => withImage(api, nextOpt))) : (0, _rxjs.of)(null);
  });
}