// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { combineLatest, map, of } from 'rxjs';
import { memo } from "../util/index.js";

function parseFlags(address, [electionsMembers, councilMembers, technicalCommitteeMembers, societyMembers, sudoKey]) {
  const isIncluded = id => address ? id.toString() === address.toString() : false;

  return {
    isCouncil: ((electionsMembers === null || electionsMembers === void 0 ? void 0 : electionsMembers.map(([id]) => id)) || councilMembers || []).some(isIncluded),
    isSociety: (societyMembers || []).some(isIncluded),
    isSudo: (sudoKey === null || sudoKey === void 0 ? void 0 : sudoKey.toString()) === (address === null || address === void 0 ? void 0 : address.toString()),
    isTechCommittee: (technicalCommitteeMembers || []).some(isIncluded)
  };
}
/**
 * @name info
 * @description Returns account membership flags
 */


export function flags(instanceId, api) {
  return memo(instanceId, address => {
    var _api$query$councilSec, _api$query$council, _api$query$technicalC, _api$query$society, _api$query$sudo;

    const councilSection = api.query.phragmenElection ? 'phragmenElection' : api.query.electionsPhragmen ? 'electionsPhragmen' : 'elections';
    return combineLatest([address && (_api$query$councilSec = api.query[councilSection]) !== null && _api$query$councilSec !== void 0 && _api$query$councilSec.members ? api.query[councilSection].members() : of(undefined), address && (_api$query$council = api.query.council) !== null && _api$query$council !== void 0 && _api$query$council.members ? api.query.council.members() : of([]), address && (_api$query$technicalC = api.query.technicalCommittee) !== null && _api$query$technicalC !== void 0 && _api$query$technicalC.members ? api.query.technicalCommittee.members() : of([]), address && (_api$query$society = api.query.society) !== null && _api$query$society !== void 0 && _api$query$society.members ? api.query.society.members() : of([]), address && (_api$query$sudo = api.query.sudo) !== null && _api$query$sudo !== void 0 && _api$query$sudo.key ? api.query.sudo.key() : of(undefined)]).pipe(map(result => parseFlags(address, result)));
  });
}