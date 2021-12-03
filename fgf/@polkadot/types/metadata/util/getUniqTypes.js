// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { flattenUniq } from "./flattenUniq.js";
import { validateTypes } from "./validateTypes.js";

/** @internal */
function unwrapCalls(mod) {
  return mod.calls ? mod.calls.unwrapOr([]) : [];
}
/** @internal */


function typeToString({
  type
}) {
  return type.toString();
}
/** @internal */


function getCallNames({
  modules
}) {
  return modules.map(mod => unwrapCalls(mod).map(({
    args
  }) => args.map(typeToString)));
}
/** @internal */


function getConstantNames({
  modules
}) {
  return modules.map(({
    constants
  }) => (constants || []).map(typeToString));
}
/** @internal */


function unwrapEvents(events) {
  return events ? events.unwrapOr([]) : [];
}
/** @internal */


function getEventNames({
  modules
}) {
  return modules.map(({
    events
  }) => unwrapEvents(events).map(({
    args
  }) => args.map(a => a.toString())));
}
/** @internal */


function unwrapStorage(storage) {
  return storage ? storage.unwrapOr({
    items: []
  }).items : [];
}
/** @internal */


function getStorageNames({
  modules
}) {
  return modules.map(({
    storage
  }) => unwrapStorage(storage).map(({
    type
  }) => type.isPlain ? [type.asPlain.toString()] : type.isMap ? [type.asMap.value.toString(), type.asMap.key.toString()] : type.isDoubleMap ? [type.asDoubleMap.value.toString(), type.asDoubleMap.key1.toString(), type.asDoubleMap.key2.toString()] : [type.asNMap.value.toString(), ...type.asNMap.keyVec.map(k => k.toString())]));
}
/** @internal */


export function getUniqTypes(registry, meta, throwError) {
  return validateTypes(registry, throwError, flattenUniq([getCallNames(meta), getConstantNames(meta), getEventNames(meta), getStorageNames(meta)]));
}