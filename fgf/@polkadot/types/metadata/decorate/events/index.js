// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { stringCamelCase } from '@polkadot/util';

function isEvent(event, sectionIndex, eventIndex) {
  return event.index[0] === sectionIndex && event.index[1] === eventIndex;
}
/** @internal */


export function decorateEvents(_, {
  modules
}, metaVersion) {
  return modules.filter(({
    events
  }) => events.isSome).reduce((result, {
    events,
    index,
    name
  }, _sectionIndex) => {
    const sectionIndex = metaVersion >= 12 ? index.toNumber() : _sectionIndex;
    result[stringCamelCase(name)] = events.unwrap().reduce((newModule, meta, eventIndex) => {
      // we don't camelCase the event name
      newModule[meta.name.toString()] = {
        is: eventRecord => isEvent(eventRecord, sectionIndex, eventIndex),
        meta
      };
      return newModule;
    }, {});
    return result;
  }, {});
}