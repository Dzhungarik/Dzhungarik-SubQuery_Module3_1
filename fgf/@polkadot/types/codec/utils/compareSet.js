// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { isObject } from '@polkadot/util';

function compareSetArray(a, b) {
  // equal number of entries and each entry in the array should match
  return a.size === b.length && !b.some(entry => !a.has(entry));
} // NOTE These are used internally and when comparing objects, expects that
// when the second is an Set<string, Codec> that the first has to be as well


export function compareSet(a, b) {
  if (Array.isArray(b)) {
    return compareSetArray(a, b);
  } else if (b instanceof Set) {
    return compareSetArray(a, [...b.values()]);
  } else if (isObject(b)) {
    return compareSetArray(a, Object.values(b));
  }

  return false;
}