// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { hexToU8a, stringCamelCase } from '@polkadot/util';
/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export function decorateConstants(registry, {
  modules
}, _metaVersion) {
  return modules.reduce((result, {
    constants,
    name
  }) => {
    if (constants.isEmpty) {
      return result;
    } // For access, we change the index names, i.e. Democracy.EnactmentPeriod -> democracy.enactmentPeriod


    result[stringCamelCase(name)] = constants.reduce((newModule, meta) => {
      // convert to the natural type as received
      const type = meta.type.toString();
      const codec = registry.createType(type, hexToU8a(meta.value.toHex()));
      codec.meta = meta;
      newModule[stringCamelCase(meta.name)] = codec;
      return newModule;
    }, {});
    return result;
  }, {});
}