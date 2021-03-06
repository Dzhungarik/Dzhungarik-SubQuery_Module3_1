"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectPackage = detectPackage;

var _xGlobal = require("@polkadot/x-global");

var _function = require("./is/function.cjs");

var _string = require("./is/string.cjs");

var _assert = require("./assert.cjs");

// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0
const DEDUPE = 'Either remove and explicitly install matching versions or dedupe using your package manager.\nThe following conflicting packages were found:';
/** @internal */

function getEntry(name) {
  const _global = _xGlobal.xglobal;

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

  const stringify = _ref => {
    let {
      name,
      version
    } = _ref;
    return `\t${version.padEnd(verLength)}\t${name}`;
  };

  return all.map(stringify).join('\n');
}
/** @internal */


function flattenVersions(entry) {
  const toPath = version => (0, _string.isString)(version) ? {
    version
  } : version;

  const all = entry.map(toPath);
  const verLength = getVersionLength(all);

  const stringify = _ref2 => {
    let {
      path,
      version
    } = _ref2;
    return `\t${version.padEnd(verLength)}\t${!path || path.length < 5 ? '<unknown>' : path}`;
  };

  return all.map(stringify).join('\n');
}
/** @internal */


function getPath(pathOrFn) {
  if ((0, _function.isFunction)(pathOrFn)) {
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


function detectPackage(_ref3, pathOrFn) {
  let {
    name,
    version
  } = _ref3;
  let deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  (0, _assert.assert)(name.startsWith('@polkadot'), () => `Invalid package descriptor ${name}`);
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