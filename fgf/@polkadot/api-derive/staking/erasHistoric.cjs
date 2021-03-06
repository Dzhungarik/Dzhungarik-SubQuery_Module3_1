"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.erasHistoric = erasHistoric;

var _rxjs = require("rxjs");

var _util = require("@polkadot/util");

var _index = require("../util/index.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
function erasHistoric(instanceId, api) {
  return (0, _index.memo)(instanceId, withActive => api.queryMulti([api.query.staking.activeEra, api.query.staking.historyDepth]).pipe((0, _rxjs.map)(([activeEraOpt, historyDepth]) => {
    const result = [];
    const max = historyDepth.toNumber();
    const activeEra = activeEraOpt.unwrapOrDefault().index;
    let lastEra = activeEra;

    while (lastEra.gte(_util.BN_ZERO) && result.length < max) {
      if (lastEra !== activeEra || withActive === true) {
        result.push(api.registry.createType('EraIndex', lastEra));
      }

      lastEra = lastEra.sub(_util.BN_ONE);
    } // go from oldest to newest


    return result.reverse();
  })));
}