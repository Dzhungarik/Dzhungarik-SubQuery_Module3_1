import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/rpc-core authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { Observable, publishReplay, refCount } from 'rxjs';
import { rpcDefinitions } from '@polkadot/types';
import { assert, hexToU8a, isFunction, isNull, isUndefined, logger, memoize, u8aToU8a } from '@polkadot/util';
import { drr, refCountDelay } from "./util/index.js";
export { packageInfo } from "./packageInfo.js";
export * from "./util/index.js";
const l = logger('rpc-core');
const EMPTY_META = {
  fallback: undefined,
  modifier: {
    isOptional: true
  },
  type: {
    asMap: {
      linked: {
        isTrue: false
      }
    },
    isMap: false
  }
}; // utility method to create a nicely-formatted error

/** @internal */

function logErrorMessage(method, {
  params,
  type
}, error) {
  const inputs = params.map(({
    isOptional,
    name,
    type
  }) => `${name}${isOptional ? '?' : ''}: ${type}`).join(', ');
  l.error(`${method}(${inputs}): ${type}:: ${error.message}`);
}

function isTreatAsHex(key) {
  // :code is problematic - it does not have the length attached, which is
  // unlike all other storage entries where it is indeed properly encoded
  return ['0x3a636f6465'].includes(key.toHex());
}
/**
 * @name Rpc
 * @summary The API may use a HTTP or WebSockets provider.
 * @description It allows for querying a Polkadot Client Node.
 * WebSockets provider is recommended since HTTP provider only supports basic querying.
 *
 * ```mermaid
 * graph LR;
 *   A[Api] --> |WebSockets| B[WsProvider];
 *   B --> |endpoint| C[ws://127.0.0.1:9944]
 * ```
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Rpc from '@polkadot/rpc-core';
 * import { WsProvider } from '@polkadot/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const rpc = new Rpc(provider);
 * ```
 */


var _instanceId = /*#__PURE__*/_classPrivateFieldLooseKey("instanceId");

var _registryDefault = /*#__PURE__*/_classPrivateFieldLooseKey("registryDefault");

var _getBlockRegistry = /*#__PURE__*/_classPrivateFieldLooseKey("getBlockRegistry");

var _storageCache = /*#__PURE__*/_classPrivateFieldLooseKey("storageCache");

export class RpcCore {
  /**
   * @constructor
   * Default constructor for the Api Object
   * @param  {ProviderInterface} provider An API provider using HTTP or WebSocket
   */
  constructor(instanceId, registry, provider, userRpc = {}) {
    Object.defineProperty(this, _instanceId, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _registryDefault, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _getBlockRegistry, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _storageCache, {
      writable: true,
      value: new Map()
    });
    this.mapping = new Map();
    this.provider = void 0;
    this.sections = [];
    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert(provider && isFunction(provider.send), 'Expected Provider to API create');
    _classPrivateFieldLooseBase(this, _instanceId)[_instanceId] = instanceId;
    _classPrivateFieldLooseBase(this, _registryDefault)[_registryDefault] = registry;
    this.provider = provider;
    const sectionNames = Object.keys(rpcDefinitions); // these are the base keys (i.e. part of jsonrpc)

    this.sections.push(...sectionNames); // decorate all interfaces, defined and user on this instance

    this.addUserInterfaces(userRpc);
  }
  /**
   * @description Returns the connected status of a provider
   */


  get isConnected() {
    return this.provider.isConnected;
  }
  /**
   * @description Manually connect from the attached provider
   */


  connect() {
    return this.provider.connect();
  }
  /**
   * @description Manually disconnect from the attached provider
   */


  disconnect() {
    return this.provider.disconnect();
  }
  /**
   * @description Sets a registry swap (typically from Api)
   */


  setRegistrySwap(registrySwap) {
    _classPrivateFieldLooseBase(this, _getBlockRegistry)[_getBlockRegistry] = memoize(registrySwap, {
      getInstanceId: () => _classPrivateFieldLooseBase(this, _instanceId)[_instanceId]
    });
  }

  addUserInterfaces(userRpc) {
    // add any extra user-defined sections
    this.sections.push(...Object.keys(userRpc).filter(key => !this.sections.includes(key))); // decorate the sections with base and user methods

    this.sections.forEach(sectionName => {
      var _ref, _ref2;

      (_ref = this)[_ref2 = sectionName] || (_ref[_ref2] = {});
      const section = this[sectionName];
      Object.entries(_objectSpread(_objectSpread({}, this._createInterface(sectionName, rpcDefinitions[sectionName] || {})), this._createInterface(sectionName, userRpc[sectionName] || {}))).forEach(([key, value]) => {
        section[key] || (section[key] = value);
      });
    });
  }

  _createInterface(section, methods) {
    return Object.entries(methods).filter(([method, {
      endpoint
    }]) => !this.mapping.has(endpoint || `${section}_${method}`)).reduce((exposed, [method, {
      endpoint
    }]) => {
      const def = methods[method];
      const isSubscription = !!def.pubsub;
      const jsonrpc = endpoint || `${section}_${method}`;
      this.mapping.set(jsonrpc, _objectSpread(_objectSpread({}, def), {}, {
        isSubscription,
        jsonrpc,
        method,
        section
      }));
      exposed[method] = isSubscription ? this._createMethodSubscribe(section, method, def) : this._createMethodSend(section, method, def);
      return exposed;
    }, {});
  }

  _memomize(creator, def) {
    const memoized = memoize(creator('scale'), {
      getInstanceId: () => _classPrivateFieldLooseBase(this, _instanceId)[_instanceId]
    });
    memoized.json = creator('json');
    memoized.raw = creator('raw');
    memoized.meta = def;
    return memoized;
  }

  _createMethodSend(section, method, def) {
    const rpcName = def.endpoint || `${section}_${method}`;
    const hashIndex = def.params.findIndex(({
      isHistoric
    }) => isHistoric);
    let memoized = null; // execute the RPC call, doing a registry swap for historic as applicable

    const callWithRegistry = async (outputAs, values) => {
      const blockHash = hashIndex === -1 ? null : values[hashIndex];
      const {
        registry
      } = outputAs === 'scale' && blockHash && _classPrivateFieldLooseBase(this, _getBlockRegistry)[_getBlockRegistry] ? await _classPrivateFieldLooseBase(this, _getBlockRegistry)[_getBlockRegistry](u8aToU8a(blockHash)) : {
        registry: _classPrivateFieldLooseBase(this, _registryDefault)[_registryDefault]
      };

      const params = this._formatInputs(registry, null, def, values);

      const data = await this.provider.send(rpcName, params.map(param => param.toJSON()));
      return outputAs === 'scale' ? this._formatOutput(registry, blockHash, method, def, params, data) : registry.createType(outputAs === 'raw' ? 'Raw' : 'Json', data);
    };

    const creator = outputAs => (...values) => {
      const isDelayed = outputAs === 'scale' && hashIndex !== -1 && !!values[hashIndex];
      return new Observable(observer => {
        callWithRegistry(outputAs, values).then(value => {
          observer.next(value);
          observer.complete();
        }).catch(error => {
          logErrorMessage(method, def, error);
          observer.error(error);
          observer.complete();
        });
        return () => {
          var _memoized;

          // delete old results from cache
          (_memoized = memoized) === null || _memoized === void 0 ? void 0 : _memoized.unmemoize(...values);
        };
      }).pipe(publishReplay(1), // create a Replay(1)
      isDelayed ? refCountDelay() // Unsubscribe after delay
      : refCount());
    };

    memoized = this._memomize(creator, def);
    return memoized;
  } // create a subscriptor, it subscribes once and resolves with the id as subscribe


  _createSubscriber({
    paramsJson,
    subName,
    subType,
    update
  }, errorHandler) {
    return new Promise((resolve, reject) => {
      this.provider.subscribe(subType, subName, paramsJson, update).then(resolve).catch(error => {
        errorHandler(error);
        reject(error);
      });
    });
  }

  _createMethodSubscribe(section, method, def) {
    const [updateType, subMethod, unsubMethod] = def.pubsub;
    const subName = `${section}_${subMethod}`;
    const unsubName = `${section}_${unsubMethod}`;
    const subType = `${section}_${updateType}`;
    let memoized = null;

    const creator = outputAs => (...values) => {
      return new Observable(observer => {
        // Have at least an empty promise, as used in the unsubscribe
        let subscriptionPromise = Promise.resolve(null);

        const registry = _classPrivateFieldLooseBase(this, _registryDefault)[_registryDefault];

        const errorHandler = error => {
          logErrorMessage(method, def, error);
          observer.error(error);
        };

        try {
          const params = this._formatInputs(registry, null, def, values);

          const paramsJson = params.map(param => param.toJSON());

          const update = (error, result) => {
            if (error) {
              logErrorMessage(method, def, error);
              return;
            }

            try {
              observer.next(outputAs === 'scale' ? this._formatOutput(registry, null, method, def, params, result) : registry.createType(outputAs === 'raw' ? 'Raw' : 'Json', result));
            } catch (error) {
              observer.error(error);
            }
          };

          subscriptionPromise = this._createSubscriber({
            paramsJson,
            subName,
            subType,
            update
          }, errorHandler);
        } catch (error) {
          errorHandler(error);
        } // Teardown logic


        return () => {
          var _memoized2;

          // Delete from cache, so old results don't hang around
          (_memoized2 = memoized) === null || _memoized2 === void 0 ? void 0 : _memoized2.unmemoize(...values); // Unsubscribe from provider

          subscriptionPromise.then(subscriptionId => isNull(subscriptionId) ? Promise.resolve(false) : this.provider.unsubscribe(subType, unsubName, subscriptionId)).catch(error => logErrorMessage(method, def, error));
        };
      }).pipe(drr());
    };

    memoized = this._memomize(creator, def);
    return memoized;
  }

  _formatInputs(registry, blockHash, def, inputs) {
    const reqArgCount = def.params.filter(({
      isOptional
    }) => !isOptional).length;
    const optText = reqArgCount === def.params.length ? '' : ` (${def.params.length - reqArgCount} optional)`;
    assert(inputs.length >= reqArgCount && inputs.length <= def.params.length, () => `Expected ${def.params.length} parameters${optText}, ${inputs.length} found instead`);
    return inputs.map((input, index) => registry.createTypeUnsafe(def.params[index].type, [input], {
      blockHash
    }));
  }

  _formatOutput(registry, blockHash, method, rpc, params, result) {
    if (rpc.type === 'StorageData') {
      const key = params[0];
      return this._formatStorageData(registry, blockHash, key, result);
    } else if (rpc.type === 'StorageChangeSet') {
      const keys = params[0];
      return keys ? this._formatStorageSet(registry, result.block, keys, result.changes) : registry.createType('StorageChangeSet', result);
    } else if (rpc.type === 'Vec<StorageChangeSet>') {
      const mapped = result.map(({
        block,
        changes
      }) => [registry.createType('Hash', block), this._formatStorageSet(registry, block, params[0], changes)]); // we only query at a specific block, not a range - flatten

      return method === 'queryStorageAt' ? mapped[0][1] : mapped;
    }

    return registry.createTypeUnsafe(rpc.type, [result], {
      blockHash
    });
  }

  _formatStorageData(registry, blockHash, key, value) {
    const isEmpty = isNull(value); // we convert to Uint8Array since it maps to the raw encoding, all
    // data will be correctly encoded (incl. numbers, excl. :code)

    const input = isEmpty ? null : isTreatAsHex(key) ? value : u8aToU8a(value);
    return this._newType(registry, blockHash, key, input, isEmpty);
  }

  _formatStorageSet(registry, blockHash, keys, changes) {
    // For StorageChangeSet, the changes has the [key, value] mappings
    const withCache = keys.length !== 1; // multiple return values (via state.storage subscription), decode the values
    // one at a time, all based on the query types. Three values can be returned -
    //   - Codec - There is a valid value, non-empty
    //   - null - The storage key is empty

    return keys.reduce((results, key, index) => {
      results.push(this._formatStorageSetEntry(registry, blockHash, key, changes, withCache, index));
      return results;
    }, []);
  }

  _formatStorageSetEntry(registry, blockHash, key, changes, witCache, entryIndex) {
    const hexKey = key.toHex();
    const found = changes.find(([key]) => key === hexKey); // if we don't find the value, this is our fallback
    //   - in the case of an array of values, fill the hole from the cache
    //   - if a single result value, don't fill - it is not an update hole
    //   - fallback to an empty option in all cases

    const value = isUndefined(found) ? witCache && _classPrivateFieldLooseBase(this, _storageCache)[_storageCache].get(hexKey) || null : found[1];
    const isEmpty = isNull(value);
    const input = isEmpty || isTreatAsHex(key) ? value : u8aToU8a(value); // store the retrieved result - the only issue with this cache is that there is no
    // clearing of it, so very long running processes (not just a couple of hours, longer)
    // will increase memory beyond what is allowed.

    _classPrivateFieldLooseBase(this, _storageCache)[_storageCache].set(hexKey, value);

    return this._newType(registry, blockHash, key, input, isEmpty, entryIndex);
  }

  _newType(registry, blockHash, key, input, isEmpty, entryIndex = -1) {
    // single return value (via state.getStorage), decode the value based on the
    // outputType that we have specified. Fallback to Raw on nothing
    const type = key.outputType || 'Raw';
    const meta = key.meta || EMPTY_META;
    const entryNum = entryIndex === -1 ? '' : ` entry ${entryIndex}:`;

    try {
      return registry.createTypeUnsafe(type, [isEmpty ? meta.fallback ? hexToU8a(meta.fallback.toHex()) : undefined : meta.modifier.isOptional ? registry.createTypeUnsafe(type, [input], {
        blockHash,
        isPedantic: true
      }) : input], {
        blockHash,
        isOptional: meta.modifier.isOptional,
        isPedantic: !meta.modifier.isOptional
      });
    } catch (error) {
      throw new Error(`Unable to decode storage ${key.section || 'unknown'}.${key.method || 'unknown'}:${entryNum}: ${error.message}`);
    }
  }

}