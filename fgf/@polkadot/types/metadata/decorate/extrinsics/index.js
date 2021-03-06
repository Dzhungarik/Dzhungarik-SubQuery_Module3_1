// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { stringCamelCase } from '@polkadot/util';
import { createUnchecked } from "./createUnchecked.js";
/** @internal */

export function decorateExtrinsics(registry, {
  modules
}, metaVersion) {
  return modules.filter(({
    calls
  }) => calls.isSome).reduce((result, {
    calls,
    index,
    name
  }, _sectionIndex) => {
    const sectionIndex = metaVersion >= 12 ? index.toNumber() : _sectionIndex;
    const section = stringCamelCase(name);
    result[section] = calls.unwrap().reduce((newModule, callMetadata, methodIndex) => {
      newModule[stringCamelCase(callMetadata.name)] = createUnchecked(registry, section, new Uint8Array([sectionIndex, methodIndex]), callMetadata);
      return newModule;
    }, {});
    return result;
  }, {});
}