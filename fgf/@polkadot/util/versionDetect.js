// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { xglobal } from '@polkadot/x-global';
import { isFunction } from "./is/function.js";
import { isString } from "./is/string.js";
import { assert } from "./assert.js";
const DEDUPE = 'Either remove and explicitly install matching versions or dedupe using your package manager.\nThe following conflicting packages were found:';
/** @internal */

function getEntry(name) {
  const _global = xglobal;

  if (!_global.__polkadotjs) {
    _global.__polkadotjs = {};
  }

  if (!_global.__polkadotjs[name]) {
    _global.__polkadotjs[name] = [];
  }

  return _global.__polkadotjs[name];
}

function getVersionLength(all) {
  let length = 0;

  for (const {
    version
  } of all) {
    length = Math.max(length, version.length);
  }

  return length;
}
/** @internal */


function flattenInfos(all) {
  const verLength = getVersionLength(all);

  const stringify = ({
    name,
    version
  }) => `\t${version.padEnd(verLength)}\t${name}`;

  return all.map(stringify).join('\n');
}
/** @internal */


function flattenVersions(entry) {
  const toPath = version => isString(version) ? {
    version
  } : version;

  const all = entry.map(toPath);
  const verLength = getVersionLength(all);

  const stringify = ({
    path,
    version
  }) => `\t${version.padEnd(verLength)}\t${!path || path.length < 5 ? '<unknown>' : path}`;

  return all.map(stringify).join('\n');
}
/** @internal */


function getPath(pathOrFn) {
  if (isFunction(pathOrFn)) {
    try {
      return pathOrFn() || '';
    } catch (error) {
      return '';
    }
  }

  return pathOrFn || '';
}
/**
 * @name detectPackage
 * @summary Checks that a specific package is only imported once
 * @description A `@polkadot/*` version detection utility, checking for one occurence of a package in addition to checking for ddependency versions.
 */


export function detectPackage({
  name,
  version
}, pathOrFn, deps = []) {
  assert(name.startsWith('@polkadot'), () => `Invalid package descriptor ${name}`);
  const entry = getEntry(name);
  entry.push({
    path: getPath(pathOrFn),
    version
  });

  if (entry.length !== 1) {
    console.warn(`${name} has multiple versions, ensure that there is only one installed.\n${DEDUPE}\n${flattenVersions(entry)}`);
  } else {
    const mismatches = deps.filter(d => d && d.version !== version);

    if (mismatches.length) {
      console.warn(`${name} requires direct dependencies exactly matching version ${version}.\n${DEDUPE}\n${flattenInfos(mismatches)}`);
    }
  }
}