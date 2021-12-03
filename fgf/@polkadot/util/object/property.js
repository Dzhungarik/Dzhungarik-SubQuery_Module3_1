// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { isUndefined } from "../is/undefined.js";
/**
 * @name objectProperty
 * @summary Assign a get property on the input object
 */

export function objectProperty(that, key, getter) {
  // We use both the hasOwnProperty as well as isUndefined checks here, since it may be set
  // in inherited classes and _Own_ properties refers to the class only, not only parents
  if (!Object.prototype.hasOwnProperty.call(that, key) && isUndefined(that[key])) {
    Object.defineProperty(that, key, {
      enumerable: true,
      // Since we don't use any additional this internally, we can use arrow (unlike lazy)
      // Unlike in lazy, we always call into the upper function, i.e. this method
      // does not cache old values (it is expected to be used for dynamic values)
      get: () => getter(key)
    });
  }
}
/**
 * @name objectProperties
 * @summary Assign get properties on the input object
 */

export function objectProperties(that, keys, getter) {
  for (let i = 0; i < keys.length; i++) {
    objectProperty(that, keys[i], k => getter(k, i));
  }
}