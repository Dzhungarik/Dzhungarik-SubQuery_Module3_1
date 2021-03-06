// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { isFunction } from '@polkadot/util';
import { memo } from "../util/index.js";
import { getInstance } from "./getInstance.js";

function parse(api, [hashes, proposals, votes]) {
  return proposals.map((proposalOpt, index) => proposalOpt && proposalOpt.isSome ? {
    hash: api.registry.createType('Hash', hashes[index]),
    proposal: proposalOpt.unwrap(),
    votes: votes[index].unwrapOr(null)
  } : null).filter(proposal => !!proposal);
}

function _proposalsFrom(instanceId, api, section) {
  return memo(instanceId, hashes => {
    var _api$query$section;

    return (isFunction((_api$query$section = api.query[section]) === null || _api$query$section === void 0 ? void 0 : _api$query$section.proposals) && hashes.length ? combineLatest([of(hashes), // this should simply be api.query[section].proposalOf.multi<Option<Proposal>>(hashes),
    // however we have had cases on Edgeware where the indices have moved around after an
    // upgrade, which results in invalid on-chain data
    combineLatest(hashes.map(hash => // this should simply be api.query[section].proposalOf.multi<Option<Proposal>>(hashes),
    // however we have had cases on Edgeware where the indices have moved around after an
    // upgrade, which results in invalid on-chain data
    api.query[section].proposalOf(hash).pipe(catchError(() => of(null))))), api.query[section].voting.multi(hashes)]) : of([[], [], []])).pipe(map(result => parse(api, result)));
  });
}

export function hasProposals(instanceId, api, _section) {
  const section = getInstance(api, _section);
  return memo(instanceId, () => {
    var _api$query$section2;

    return of(isFunction((_api$query$section2 = api.query[section]) === null || _api$query$section2 === void 0 ? void 0 : _api$query$section2.proposals));
  });
}
export function proposalCount(instanceId, api, _section) {
  const section = getInstance(api, _section);
  return memo(instanceId, () => isFunction(api.query[section].proposalCount) ? api.query[section].proposalCount() : of(null));
}
export function proposalHashes(instanceId, api, _section) {
  const section = getInstance(api, _section);
  return memo(instanceId, () => {
    var _api$query$section3;

    return isFunction((_api$query$section3 = api.query[section]) === null || _api$query$section3 === void 0 ? void 0 : _api$query$section3.proposals) ? api.query[section].proposals() : of([]);
  });
}
export function proposals(instanceId, api, _section) {
  const section = getInstance(api, _section);

  const proposalsFrom = _proposalsFrom(instanceId, api, section);

  const getHashes = proposalHashes(instanceId, api, _section);
  return memo(instanceId, () => getHashes().pipe(switchMap(proposalsFrom)));
}
export function proposal(instanceId, api, _section) {
  const section = getInstance(api, _section);

  const proposalsFrom = _proposalsFrom(instanceId, api, section);

  return memo(instanceId, hash => {
    var _api$query$section4;

    return isFunction((_api$query$section4 = api.query[section]) === null || _api$query$section4 === void 0 ? void 0 : _api$query$section4.proposals) ? proposalsFrom([hash]).pipe(map(([proposal]) => proposal)) : of(null);
  });
}