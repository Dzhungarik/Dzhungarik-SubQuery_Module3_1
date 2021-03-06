"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contributions = contributions;

var _rxjs = require("rxjs");

var _util = require("@polkadot/util");

var _index = require("../util/index.cjs");

var _util2 = require("./util.cjs");

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
const PAGE_SIZE_K = 1000; // limit aligned with the 1k on the node (trie lookups are heavy)

function _getUpdates(api, paraId) {
  let added = [];
  let removed = [];
  return api.query.system.events().pipe((0, _rxjs.switchMap)(events => {
    const changes = (0, _util2.extractContributed)(paraId, events);

    if (changes.added.length || changes.removed.length) {
      var _events$createdAtHash;

      added = added.concat(...changes.added);
      removed = removed.concat(...changes.removed);
      return (0, _rxjs.of)({
        added,
        addedDelta: changes.added,
        blockHash: ((_events$createdAtHash = events.createdAtHash) === null || _events$createdAtHash === void 0 ? void 0 : _events$createdAtHash.toHex()) || '-',
        removed,
        removedDelta: changes.removed
      });
    }

    return _rxjs.EMPTY;
  }), (0, _rxjs.startWith)({
    added,
    addedDelta: [],
    blockHash: '-',
    removed,
    removedDelta: []
  }));
}

function _eventTriggerAll(api, paraId) {
  return api.query.system.events().pipe((0, _rxjs.switchMap)(events => {
    var _events$createdAtHash2;

    const items = events.filter(({
      event: {
        data: [eventParaId],
        method,
        section
      }
    }) => section === 'crowdloan' && ['AllRefunded', 'Dissolved', 'PartiallyRefunded'].includes(method) && eventParaId.eq(paraId));
    return items.length ? (0, _rxjs.of)(((_events$createdAtHash2 = events.createdAtHash) === null || _events$createdAtHash2 === void 0 ? void 0 : _events$createdAtHash2.toHex()) || '-') : _rxjs.EMPTY;
  }), (0, _rxjs.startWith)('-'));
}

function _getKeysPaged(api, childKey) {
  const startSubject = new _rxjs.BehaviorSubject(undefined);
  return startSubject.pipe((0, _rxjs.switchMap)(startKey => api.rpc.childstate.getKeysPaged(childKey, '0x', PAGE_SIZE_K, startKey)), (0, _rxjs.tap)(keys => {
    setTimeout(() => {
      keys.length === PAGE_SIZE_K ? startSubject.next(keys[PAGE_SIZE_K - 1].toHex()) : startSubject.complete();
    }, 0);
  }), (0, _rxjs.toArray)(), // toArray since we want to startSubject to be completed
  (0, _rxjs.map)(keyArr => (0, _util.arrayFlatten)(keyArr)));
}

function _getAll(api, paraId, childKey) {
  return _eventTriggerAll(api, paraId).pipe((0, _rxjs.switchMap)(() => // FIXME Needs testing and being enabled
  // eslint-disable-next-line no-constant-condition
  (0, _util.isFunction)(api.rpc.childstate.getKeysPaged) && false ? _getKeysPaged(api, childKey) : api.rpc.childstate.getKeys(childKey, '0x')), (0, _rxjs.map)(keys => keys.map(k => k.toHex())));
}

function _contributions(api, paraId, childKey) {
  return (0, _rxjs.combineLatest)([_getAll(api, paraId, childKey), _getUpdates(api, paraId)]).pipe((0, _rxjs.map)(([keys, {
    added,
    blockHash,
    removed
  }]) => {
    const contributorsMap = {};
    keys.forEach(k => {
      contributorsMap[k] = true;
    });
    added.forEach(k => {
      contributorsMap[k] = true;
    });
    removed.forEach(k => {
      delete contributorsMap[k];
    });
    return {
      blockHash,
      contributorsHex: Object.keys(contributorsMap)
    };
  }));
}

function contributions(instanceId, api) {
  return (0, _index.memo)(instanceId, paraId => api.derive.crowdloan.childKey(paraId).pipe((0, _rxjs.switchMap)(childKey => childKey ? _contributions(api, paraId, childKey) : (0, _rxjs.of)({
    blockHash: '-',
    contributorsHex: []
  }))));
}