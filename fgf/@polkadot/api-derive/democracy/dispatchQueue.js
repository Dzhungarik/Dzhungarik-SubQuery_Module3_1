import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { isFunction, stringToHex } from '@polkadot/util';
import { memo } from "../util/index.js";
const DEMOCRACY_ID = stringToHex('democrac');

function queryQueue(api) {
  return api.query.democracy.dispatchQueue().pipe(switchMap(dispatches => combineLatest([of(dispatches), api.derive.democracy.preimages(dispatches.map(([, hash]) => hash))])), map(([dispatches, images]) => dispatches.map(([at, imageHash, index], dispatchIndex) => ({
    at,
    image: images[dispatchIndex],
    imageHash,
    index
  }))));
}

function schedulerEntries(api) {
  // We don't get entries, but rather we get the keys (triggered via finished referendums) and
  // the subscribe to those keys - this means we pickup when the schedulers actually executes
  // at a block, the entry for that block will become empty
  return api.derive.democracy.referendumsFinished().pipe(switchMap(() => api.query.scheduler.agenda.keys()), switchMap(keys => {
    const blockNumbers = keys.map(({
      args: [blockNumber]
    }) => blockNumber);
    return blockNumbers.length ? combineLatest([of(blockNumbers), // this should simply be api.query.scheduler.agenda.multi<Vec<Option<Scheduled>>>,
    // however we have had cases on Darwinia where the indices have moved around after an
    // upgrade, which results in invalid on-chain data
    combineLatest(blockNumbers.map(blockNumber => api.query.scheduler.agenda(blockNumber).pipe( // this does create an issue since it discards all at that block
    catchError(() => of(null)))))]) : of([[], []]);
  }));
}

function queryScheduler(api) {
  return schedulerEntries(api).pipe(switchMap(([blockNumbers, agendas]) => {
    const result = [];
    blockNumbers.forEach((at, index) => {
      (agendas[index] || []).filter(opt => opt.isSome).forEach(optScheduled => {
        const scheduled = optScheduled.unwrap();

        if (scheduled.maybeId.isSome) {
          const id = scheduled.maybeId.unwrap().toHex();

          if (id.startsWith(DEMOCRACY_ID)) {
            const [, index] = api.registry.createType('(u64, ReferendumIndex)', id);
            const imageHash = scheduled.call.args[0];
            result.push({
              at,
              imageHash,
              index
            });
          }
        }
      });
    });
    return result.length ? combineLatest([of(result), api.derive.democracy.preimages(result.map(({
      imageHash
    }) => imageHash))]) : of([[], []]);
  }), map(([infos, images]) => infos.map((info, index) => _objectSpread(_objectSpread({}, info), {}, {
    image: images[index]
  }))));
}

export function dispatchQueue(instanceId, api) {
  return memo(instanceId, () => {
    var _api$query$scheduler;

    return isFunction((_api$query$scheduler = api.query.scheduler) === null || _api$query$scheduler === void 0 ? void 0 : _api$query$scheduler.agenda) ? queryScheduler(api) : api.query.democracy.dispatchQueue ? queryQueue(api) : of([]);
  });
}