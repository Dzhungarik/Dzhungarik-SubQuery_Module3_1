// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { stringCamelCase } from '@polkadot/util';

function isError({
  error,
  index
}, sectionIndex, errorIndex) {
  return index.eq(sectionIndex) && error.eq(errorIndex);
}
/** @internal */


export function decorateErrors(_, {
  modules
}, metaVersion) {
  return modules.reduce((result, {
    errors,
    index,
    name
  }, _sectionIndex) => {
    if (!errors.length) {
      return result;
    }

    const sectionIndex = metaVersion >= 12 ? index.toNumber() : _sectionIndex;
    result[stringCamelCase(name)] = errors.reduce((newModule, meta, errorIndex) => {
      // we don't camelCase the error name
      newModule[meta.name.toString()] = {
        is: moduleError => isError(moduleError, sectionIndex, errorIndex),
        meta
      };
      return newModule;
    }, {});
    return result;
  }, {});
}