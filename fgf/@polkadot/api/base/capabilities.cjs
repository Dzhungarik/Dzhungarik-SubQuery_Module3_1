"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectedCapabilities = detectedCapabilities;

var _rxjs = require("rxjs");

var _util = require("@polkadot/util");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
const NumberMap = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

function mapCapabilities({
  accountIdLength,
  refcount1Length,
  refcount2Length,
  refcount3Length
}, [leasePeriodsPerSlot, slotRangeCount], [stakingVersion], [keys, accountInfo]) {
  const types = {}; // AccountInfo

  if (accountInfo) {
    const length = accountInfo.length;

    if (length === refcount1Length) {
      types.AccountInfo = 'AccountInfoWithRefCount';
    } else if (length === refcount2Length) {
      types.AccountInfo = 'AccountInfoWithDualRefCount';
    } else if (length === refcount3Length) {
      types.AccountInfo = 'AccountInfoWithTripleRefCount';
    }
  } // ValidatorPrefs


  if (stakingVersion) {
    if (stakingVersion.index >= 4) {
      // v1 = index 0, V5 = index 4
      types.ValidatorPrefs = 'ValidatorPrefsWithBlocked';
    } else {
      types.ValidatorPrefs = 'ValidatorPrefsWithCommission';
    }
  } // Keys


  if (keys) {
    try {
      const [offset, numItems] = (0, _util.compactFromU8a)(keys);
      const tupleLength = (keys.length - offset) / numItems.toNumber();
      const numIds = tupleLength / accountIdLength;
      const numIdsRound = Math.floor(numIds);
      (0, _util.assert)(numIds >= 2 && numIds <= 11, () => `Detected ${numIds} in Keys, should be >= 2 and <= 11`);

      if (numIdsRound !== numIds) {
        // Beefy?
        if ((numIdsRound - 1) * accountIdLength + 33 === tupleLength) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          types.Keys = `SessionKeys${numIdsRound - 1}B`;
        } else {
          (0, _util.assert)(false, () => `Expected integer number of keys, found ${numIds.toFixed(2)}`);
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        types.Keys = `SessionKeys${numIds - 1}`;
      }
    } catch {// ignore
    }
  } // auctions


  if (leasePeriodsPerSlot && slotRangeCount) {
    const _enum = [];

    for (let i = 0; leasePeriodsPerSlot.gtn(i); i++) {
      for (let j = i; leasePeriodsPerSlot.gtn(j); j++) {
        _enum.push(`${NumberMap[i]}${NumberMap[j]}`);
      }
    }

    types.SlotRange = {
      _enum
    };
    types.WinningData = `[WinningDataEntry; ${slotRangeCount.toNumber()}]`;
  }

  return types;
}

function filterEntries(original) {
  const included = original.map(c => !!c);
  return {
    filtered: original.filter((_, index) => included[index]),
    included,
    original
  };
}

function extractResults(results, map) {
  let offset = -1;
  return map.included.map(isIncluded => isIncluded ? results[++offset] : null);
}
/**
 * @description Query the chain for the specific capabilities
 */


function detectedCapabilities(api, blockHash) {
  var _api$consts$auctions, _api$consts$auctions2, _api$query$staking, _api$query$session, _api$query$system, _api$query$system$acc;

  const emptyAccountId = api.registry.createType('AccountId');
  const consts = filterEntries([(_api$consts$auctions = api.consts.auctions) === null || _api$consts$auctions === void 0 ? void 0 : _api$consts$auctions.leasePeriodsPerSlot, (_api$consts$auctions2 = api.consts.auctions) === null || _api$consts$auctions2 === void 0 ? void 0 : _api$consts$auctions2.slotRangeCount]);
  const queries = filterEntries([(_api$query$staking = api.query.staking) === null || _api$query$staking === void 0 ? void 0 : _api$query$staking.storageVersion]);
  const raws = filterEntries([(_api$query$session = api.query.session) === null || _api$query$session === void 0 ? void 0 : _api$query$session.queuedKeys.key(), (_api$query$system = api.query.system) === null || _api$query$system === void 0 ? void 0 : (_api$query$system$acc = _api$query$system.account) === null || _api$query$system$acc === void 0 ? void 0 : _api$query$system$acc.key(emptyAccountId)]);
  return (0, _rxjs.combineLatest)([consts.filtered.length ? blockHash // FIXME consts don't have .at as of yet...
  ? (0, _rxjs.of)([]) : (0, _rxjs.of)(consts.filtered) : (0, _rxjs.of)([]), queries.filtered.length ? blockHash ? (0, _rxjs.combineLatest)(queries.filtered.map(c => c.at(blockHash))) : api.queryMulti(queries.filtered) : (0, _rxjs.of)([]), raws.filtered.length ? blockHash ? (0, _rxjs.combineLatest)(raws.filtered.map(k => api.rpc.state.getStorage.raw(k, blockHash))) : (0, _rxjs.combineLatest)(raws.filtered.map(k => api.rpc.state.getStorage.raw(k))) : (0, _rxjs.of)([])]).pipe((0, _rxjs.map)(([cResults, qResults, rResults]) => mapCapabilities({
    accountIdLength: emptyAccountId.encodedLength,
    refcount1Length: api.registry.createType('AccountInfoWithRefCount').encodedLength,
    refcount2Length: api.registry.createType('AccountInfoWithDualRefCount').encodedLength,
    refcount3Length: api.registry.createType('AccountInfoWithTripleRefCount').encodedLength
  }, extractResults(cResults, consts), extractResults(qResults, queries), extractResults(rResults, raws))), (0, _rxjs.take)(1), (0, _rxjs.catchError)(() => (0, _rxjs.of)({})));
}