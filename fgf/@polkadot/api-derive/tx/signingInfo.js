// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { combineLatest, map, of, switchMap } from 'rxjs';
import { isNumber, isUndefined } from '@polkadot/util';
import { FALLBACK_MAX_HASH_COUNT, FALLBACK_PERIOD, MAX_FINALITY_LAG, MORTAL_PERIOD } from "./constants.js";

function latestNonce(api, address) {
  return api.derive.balances.account(address).pipe(map(({
    accountNonce
  }) => accountNonce));
}

function nextNonce(api, address) {
  var _api$rpc$system;

  return (_api$rpc$system = api.rpc.system) !== null && _api$rpc$system !== void 0 && _api$rpc$system.accountNextIndex ? api.rpc.system.accountNextIndex(address) : latestNonce(api, address);
}

function signingHeader(api) {
  return combineLatest([api.rpc.chain.getHeader(), api.rpc.chain.getFinalizedHead()]).pipe(switchMap(([bestHeader, finHash]) => // retrieve the headers - in the case of the current block, we use the parent
  // to minimize (not completely remove) the impact that forks do have on the system
  // (when at genesis, just return the current header as the last known)
  bestHeader.parentHash.isEmpty ? of([bestHeader, bestHeader]) : combineLatest([api.rpc.chain.getHeader(bestHeader.parentHash), api.rpc.chain.getHeader(finHash)])), map(([current, finalized]) => // determine the hash to use, current when lag > max, else finalized
  current.number.unwrap().sub(finalized.number.unwrap()).gt(MAX_FINALITY_LAG) ? current : finalized));
}

export function signingInfo(_instanceId, api) {
  // no memo, we want to do this fresh on each run
  return (address, nonce, era) => combineLatest([// retrieve nonce if none was specified
  isUndefined(nonce) ? latestNonce(api, address) : nonce === -1 ? nextNonce(api, address) : of(api.registry.createType('Index', nonce)), // if no era (create) or era > 0 (mortal), do block retrieval
  isUndefined(era) || isNumber(era) && era > 0 ? signingHeader(api) : of(null)]).pipe(map(([nonce, header]) => {
    var _api$consts$system, _api$consts$system$bl, _api$consts$babe, _api$consts$timestamp;

    return {
      header,
      mortalLength: Math.min(((_api$consts$system = api.consts.system) === null || _api$consts$system === void 0 ? void 0 : (_api$consts$system$bl = _api$consts$system.blockHashCount) === null || _api$consts$system$bl === void 0 ? void 0 : _api$consts$system$bl.toNumber()) || FALLBACK_MAX_HASH_COUNT, MORTAL_PERIOD.div(((_api$consts$babe = api.consts.babe) === null || _api$consts$babe === void 0 ? void 0 : _api$consts$babe.expectedBlockTime) || ((_api$consts$timestamp = api.consts.timestamp) === null || _api$consts$timestamp === void 0 ? void 0 : _api$consts$timestamp.minimumPeriod.muln(2)) || FALLBACK_PERIOD).iadd(MAX_FINALITY_LAG).toNumber()),
      nonce
    };
  }));
}