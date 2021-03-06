import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { BehaviorSubject, combineLatest, map, of, switchMap, tap, toArray } from 'rxjs';
import { decorateDerive } from '@polkadot/api-derive';
import { memo, RpcCore } from '@polkadot/rpc-core';
import { WsProvider } from '@polkadot/rpc-provider';
import { expandMetadata, TypeRegistry, unwrapStorageType } from '@polkadot/types';
import { arrayChunk, arrayFlatten, assert, BN, BN_ZERO, compactStripLength, logger, u8aToHex } from '@polkadot/util';
import { createSubmittable } from "../submittable/index.js";
import { augmentObject } from "../util/augmentObject.js";
import { decorateSections } from "../util/decorate.js";
import { extractStorageArgs } from "../util/validate.js";
import { Events } from "./Events.js";
// the max amount of keys/values that we will retrieve at once
const PAGE_SIZE_K = 1000; // limit aligned with the 1k on the node (trie lookups are heavy)

const PAGE_SIZE_V = 250; // limited since the data may be very large (e.g. misfiring elections)

const l = logger('api/init');
let instanceCounter = 0;

var _instanceId = /*#__PURE__*/_classPrivateFieldLooseKey("instanceId");

var _registry = /*#__PURE__*/_classPrivateFieldLooseKey("registry");

export class Decorate extends Events {
  // HACK Use BN import so decorateDerive works... yes, wtf.
  // latest extrinsic version

  /**
   * This is the one and only method concrete children classes need to implement.
   * It's a higher-order function, which takes one argument
   * `method: Method extends (...args: any[]) => Observable<any>`
   * (and one optional `options`), and should return the user facing method.
   * For example:
   * - For ApiRx, `decorateMethod` should just be identity, because the input
   * function is already an Observable
   * - For ApiPromise, `decorateMethod` should return a function that takes all
   * the parameters from `method`, adds an optional `callback` argument, and
   * returns a Promise.
   *
   * We could easily imagine other user-facing interfaces, which are simply
   * implemented by transforming the Observable to Stream/Iterator/Kefir/Bacon
   * via `decorateMethod`.
   */

  /**
   * @description Create an instance of the class
   *
   * @param options Options object to create API instance or a Provider instance
   *
   * @example
   * <BR>
   *
   * ```javascript
   * import Api from '@polkadot/api/promise';
   *
   * const api = new Api().isReady();
   *
   * api.rpc.subscribeNewHeads((header) => {
   *   console.log(`new block #${header.number.toNumber()}`);
   * });
   * ```
   */
  constructor(options, type, decorateMethod) {
    var _options$source;

    super();
    Object.defineProperty(this, _instanceId, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _registry, {
      writable: true,
      value: void 0
    });
    this.__phantom = new BN(0);
    this._consts = {};
    this._derive = void 0;
    this._errors = {};
    this._events = {};
    this._extrinsics = void 0;
    this._extrinsicType = 4;
    this._genesisHash = void 0;
    this._isConnected = void 0;
    this._isReady = false;
    this._options = void 0;
    this._query = {};
    this._queryMulti = void 0;
    this._rpc = void 0;
    this._rpcCore = void 0;
    this._runtimeChain = void 0;
    this._runtimeMetadata = void 0;
    this._runtimeVersion = void 0;
    this._rx = {
      consts: {},
      query: {},
      tx: {}
    };
    this._type = void 0;
    this._decorateMethod = void 0;

    this._rxDecorateMethod = method => {
      return method;
    };

    _classPrivateFieldLooseBase(this, _instanceId)[_instanceId] = `${++instanceCounter}`;
    _classPrivateFieldLooseBase(this, _registry)[_registry] = ((_options$source = options.source) === null || _options$source === void 0 ? void 0 : _options$source.registry) || options.registry || new TypeRegistry();
    this._rx.registry = _classPrivateFieldLooseBase(this, _registry)[_registry];
    const thisProvider = options.source ? options.source._rpcCore.provider.clone() : options.provider || new WsProvider();
    this._decorateMethod = decorateMethod;
    this._options = options;
    this._type = type; // The RPC interface decorates the known interfaces on init

    this._rpcCore = new RpcCore(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], _classPrivateFieldLooseBase(this, _registry)[_registry], thisProvider, this._options.rpc);
    this._isConnected = new BehaviorSubject(this._rpcCore.provider.isConnected);
    this._rx.hasSubscriptions = this._rpcCore.provider.hasSubscriptions;
  }
  /**
   * @description Return the current used registry
   */


  get registry() {
    return _classPrivateFieldLooseBase(this, _registry)[_registry];
  }
  /**
   * @description Creates an instance of a type as registered
   */


  createType(type, ...params) {
    return _classPrivateFieldLooseBase(this, _registry)[_registry].createType(type, ...params);
  }
  /**
   * @description Register additional user-defined of chain-specific types in the type registry
   */


  registerTypes(types) {
    types && _classPrivateFieldLooseBase(this, _registry)[_registry].register(types);
  }
  /**
   * @returns `true` if the API operates with subscriptions
   */


  get hasSubscriptions() {
    return this._rpcCore.provider.hasSubscriptions;
  }
  /**
   * @returns `true` if the API decorate multi-key queries
   */


  get supportMulti() {
    return this._rpcCore.provider.hasSubscriptions || !!this._rpcCore.state.queryStorageAt;
  }

  _createDecorated(registry, fromEmpty, blockHash, decoratedApi) {
    if (!decoratedApi) {
      decoratedApi = {
        consts: {},
        errors: {},
        events: {},
        query: {}
      };
    }

    if (!registry.decoratedMeta) {
      registry.decoratedMeta = expandMetadata(registry.registry, registry.metadata);
    } // adjust the versioned registry


    augmentObject('consts', registry.decoratedMeta.consts, decoratedApi.consts, fromEmpty);
    augmentObject('errors', registry.decoratedMeta.errors, decoratedApi.errors, fromEmpty);
    augmentObject('events', registry.decoratedMeta.events, decoratedApi.events, fromEmpty);
    const storage = blockHash ? this._decorateStorageAt(registry.decoratedMeta, this._decorateMethod, blockHash) : this._decorateStorage(registry.decoratedMeta, this._decorateMethod);
    augmentObject('query', storage, decoratedApi.query, fromEmpty);
    return {
      decoratedApi,
      decoratedMeta: registry.decoratedMeta
    };
  }

  _injectMetadata(registry, fromEmpty) {
    // clear the decoration, we are redoing it here
    if (fromEmpty || !registry.decoratedApi) {
      registry.decoratedApi = {
        consts: {},
        errors: {},
        events: {},
        query: {}
      };
    }

    const {
      decoratedApi,
      decoratedMeta
    } = this._createDecorated(registry, fromEmpty, null, registry.decoratedApi);

    this._consts = decoratedApi.consts;
    this._errors = decoratedApi.errors;
    this._events = decoratedApi.events;
    this._query = decoratedApi.query;

    if (fromEmpty || !this._extrinsics) {
      this._extrinsics = this._decorateExtrinsics(decoratedMeta, this._decorateMethod);
      this._rx.tx = this._decorateExtrinsics(decoratedMeta, this._rxDecorateMethod);
    } else {
      augmentObject('tx', this._decorateExtrinsics(decoratedMeta, this._decorateMethod), this._extrinsics, false);
      augmentObject(null, this._decorateExtrinsics(decoratedMeta, this._rxDecorateMethod), this._rx.tx, false);
    } // rx


    augmentObject(null, this._decorateStorage(decoratedMeta, this._rxDecorateMethod), this._rx.query, fromEmpty);
    augmentObject(null, decoratedMeta.consts, this._rx.consts, fromEmpty);
  }
  /**
   * @deprecated
   * backwards compatible endpoint for metadata injection, may be removed in the future (However, it is still useful for testing injection)
   */


  injectMetadata(metadata, fromEmpty, registry) {
    this._injectMetadata({
      metadata,
      registry: registry || _classPrivateFieldLooseBase(this, _registry)[_registry],
      specName: _classPrivateFieldLooseBase(this, _registry)[_registry].createType('Text'),
      specVersion: BN_ZERO
    }, fromEmpty);
  }

  _decorateFunctionMeta(input, output) {
    output.meta = input.meta;
    output.method = input.method;
    output.section = input.section;
    output.toJSON = input.toJSON;

    if (input.callIndex) {
      output.callIndex = input.callIndex;
    }

    return output;
  } // Filter all RPC methods based on the results of the rpc_methods call. We do this in the following
  // manner to cater for both old and new:
  //   - when the number of entries are 0, only remove the ones with isOptional (account & contracts)
  //   - when non-zero, remove anything that is not in the array (we don't do this)


  _filterRpc(methods, additional) {
    // add any specific user-base RPCs
    if (Object.keys(additional).length !== 0) {
      this._rpcCore.addUserInterfaces(additional); // re-decorate, only adding any new additional interfaces


      this._decorateRpc(this._rpcCore, this._decorateMethod, this._rpc);

      this._decorateRpc(this._rpcCore, this._rxDecorateMethod, this._rx.rpc);
    }

    this._filterRpcMethods(methods);
  }

  _filterRpcMethods(exposed) {
    const hasResults = exposed.length !== 0;
    const allKnown = [...this._rpcCore.mapping.entries()];
    const allKeys = allKnown.reduce((allKeys, [, {
      alias,
      endpoint,
      method,
      pubsub,
      section
    }]) => {
      allKeys.push(`${section}_${method}`);

      if (pubsub) {
        allKeys.push(`${section}_${pubsub[1]}`);
        allKeys.push(`${section}_${pubsub[2]}`);
      }

      if (alias) {
        allKeys.push(...alias);
      }

      if (endpoint) {
        allKeys.push(endpoint);
      }

      return allKeys;
    }, []);
    const unknown = exposed.filter(k => !allKeys.includes(k));
    const deletion = allKnown.filter(([k]) => hasResults && !exposed.includes(k) && k !== 'rpc_methods');

    if (unknown.length) {
      l.warn(`RPC methods not decorated: ${unknown.join(', ')}`);
    } // loop through all entries we have (populated in decorate) and filter as required
    // only remove when we have results and method missing, or with no results if optional


    deletion.forEach(([, {
      method,
      section
    }]) => {
      delete this._rpc[section][method];
      delete this._rx.rpc[section][method];
    });
  }

  _decorateRpc(rpc, decorateMethod, input = {}) {
    return rpc.sections.reduce((out, _sectionName) => {
      const sectionName = _sectionName;

      if (!out[sectionName]) {
        // out and section here are horrors to get right from a typing perspective :(
        out[sectionName] = Object.entries(rpc[sectionName]).reduce((section, [methodName, method]) => {
          //  skip subscriptions where we have a non-subscribe interface
          if (this.hasSubscriptions || !(methodName.startsWith('subscribe') || methodName.startsWith('unsubscribe'))) {
            section[methodName] = decorateMethod(method, {
              methodName
            }); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

            section[methodName].json = decorateMethod(method.json, {
              methodName
            }); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

            section[methodName].raw = decorateMethod(method.raw, {
              methodName
            }); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

            section[methodName].meta = method.meta;
          }

          return section;
        }, {});
      }

      return out;
    }, input);
  } // only be called if supportMulti is true


  _decorateMulti(decorateMethod) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return decorateMethod(calls => (this.hasSubscriptions ? this._rpcCore.state.subscribeStorage : this._rpcCore.state.queryStorageAt)(calls.map(arg => Array.isArray(arg) ? [arg[0].creator, ...arg.slice(1)] : [arg.creator])));
  }

  _decorateExtrinsics({
    tx
  }, decorateMethod) {
    const creator = createSubmittable(this._type, this._rx, decorateMethod);
    return Object.entries(tx).reduce((out, [name, section]) => {
      out[name] = Object.entries(section).reduce((out, [name, method]) => {
        out[name] = this._decorateExtrinsicEntry(method, creator);
        return out;
      }, {});
      return out;
    }, creator);
  }

  _decorateExtrinsicEntry(method, creator) {
    const decorated = (...params) => creator(method(...params)); // pass through the `.is`


    decorated.is = other => method.is(other); // eslint-disable-next-line @typescript-eslint/no-unsafe-return


    return this._decorateFunctionMeta(method, decorated);
  }

  _decorateStorage({
    query
  }, decorateMethod) {
    return Object.entries(query).reduce((out, [name, section]) => {
      out[name] = Object.entries(section).reduce((out, [name, method]) => {
        out[name] = this._decorateStorageEntry(method, decorateMethod);
        return out;
      }, {});
      return out;
    }, {});
  }

  _decorateStorageAt({
    query
  }, decorateMethod, blockHash) {
    return Object.entries(query).reduce((out, [name, section]) => {
      out[name] = Object.entries(section).reduce((out, [name, method]) => {
        out[name] = this._decorateStorageEntryAt(method, decorateMethod, blockHash);
        return out;
      }, {});
      return out;
    }, {});
  }

  _decorateStorageEntry(creator, decorateMethod) {
    // get the storage arguments, with DoubleMap as an array entry, otherwise spread
    const getArgs = args => extractStorageArgs(_classPrivateFieldLooseBase(this, _registry)[_registry], creator, args); // Disable this where it occurs for each field we are decorating

    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */


    const decorated = this._decorateStorageCall(creator, decorateMethod);

    decorated.creator = creator;
    decorated.at = decorateMethod((hash, ...args) => this._rpcCore.state.getStorage(getArgs(args), hash));
    decorated.hash = decorateMethod((...args) => this._rpcCore.state.getStorageHash(getArgs(args)));

    decorated.is = key => key.section === creator.section && key.method === creator.method;

    decorated.key = (...args) => u8aToHex(compactStripLength(creator(creator.meta.type.isPlain ? undefined : creator.meta.type.isMap ? args[0] : creator.meta.type.isDoubleMap ? [args[0], args[1]] : args))[1]);

    decorated.keyPrefix = (...keys) => u8aToHex(creator.keyPrefix(...keys));

    decorated.range = decorateMethod((range, ...args) => this._decorateStorageRange(decorated, args, range));
    decorated.size = decorateMethod((...args) => this._rpcCore.state.getStorageSize(getArgs(args)));
    decorated.sizeAt = decorateMethod((hash, ...args) => this._rpcCore.state.getStorageSize(getArgs(args), hash)); // FIXME NMap support
    // .keys() & .entries() only available on map types

    if (creator.iterKey && (creator.meta.type.isMap || creator.meta.type.isDoubleMap || creator.meta.type.isNMap)) {
      decorated.entries = decorateMethod(memo(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], (...args) => this._retrieveMapEntries(creator, null, args)));
      decorated.entriesAt = decorateMethod(memo(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], (hash, ...args) => this._retrieveMapEntries(creator, hash, args)));
      decorated.entriesPaged = decorateMethod(memo(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], opts => this._retrieveMapEntriesPaged(creator, opts)));
      decorated.keys = decorateMethod(memo(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], (...args) => this._retrieveMapKeys(creator, null, args)));
      decorated.keysAt = decorateMethod(memo(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], (hash, ...args) => this._retrieveMapKeys(creator, hash, args)));
      decorated.keysPaged = decorateMethod(memo(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], opts => this._retrieveMapKeysPaged(creator, opts)));
    }

    if (this.supportMulti) {
      // When using double map storage function, user need to pass double map key as an array
      decorated.multi = decorateMethod(args => this._retrieveMulti(args.map(arg => [creator, arg])));
    }
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */


    return this._decorateFunctionMeta(creator, decorated);
  }

  _decorateStorageEntryAt(creator, decorateMethod, blockHash) {
    // get the storage arguments, with DoubleMap as an array entry, otherwise spread
    const getArgs = args => extractStorageArgs(_classPrivateFieldLooseBase(this, _registry)[_registry], creator, args); // Disable this where it occurs for each field we are decorating

    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */


    const decorated = decorateMethod((...args) => this._rpcCore.state.getStorage(getArgs(args), blockHash));
    decorated.creator = creator;
    decorated.hash = decorateMethod((...args) => this._rpcCore.state.getStorageHash(getArgs(args), blockHash));

    decorated.is = key => key.section === creator.section && key.method === creator.method;

    decorated.key = (...args) => u8aToHex(compactStripLength(creator(creator.meta.type.isPlain ? undefined : creator.meta.type.isMap ? args[0] : creator.meta.type.isDoubleMap ? [args[0], args[1]] : args))[1]);

    decorated.keyPrefix = (...keys) => u8aToHex(creator.keyPrefix(...keys));

    decorated.size = decorateMethod((...args) => this._rpcCore.state.getStorageSize(getArgs(args), blockHash)); // FIXME NMap support
    // .keys() & .entries() only available on map types

    if (creator.iterKey && (creator.meta.type.isMap || creator.meta.type.isDoubleMap)) {
      decorated.entries = decorateMethod(memo(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], (...args) => this._retrieveMapEntries(creator, blockHash, args)));
      decorated.keys = decorateMethod(memo(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], (...args) => this._retrieveMapKeys(creator, blockHash, args)));
    }
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */


    return this._decorateFunctionMeta(creator, decorated);
  } // Decorate the base storage call. In the case or rxjs or promise-without-callback (await)
  // we make a subscription, alternatively we push this through a single-shot query


  _decorateStorageCall(creator, decorateMethod) {
    return decorateMethod((...args) => {
      return this.hasSubscriptions ? this._rpcCore.state.subscribeStorage([extractStorageArgs(_classPrivateFieldLooseBase(this, _registry)[_registry], creator, args)]).pipe(map(([data]) => data) // extract first/only result from list
      ) : this._rpcCore.state.getStorage(extractStorageArgs(_classPrivateFieldLooseBase(this, _registry)[_registry], creator, args));
    }, {
      methodName: creator.method,
      overrideNoSub: (...args) => this._rpcCore.state.getStorage(extractStorageArgs(_classPrivateFieldLooseBase(this, _registry)[_registry], creator, args))
    });
  }

  _decorateStorageRange(decorated, args, range) {
    const outputType = unwrapStorageType(_classPrivateFieldLooseBase(this, _registry)[_registry], decorated.creator.meta.type, decorated.creator.meta.modifier.isOptional);
    return this._rpcCore.state.queryStorage([decorated.key(...args)], ...range).pipe(map(result => result.map(([blockHash, [value]]) => [blockHash, this.createType(outputType, value.isSome ? value.unwrap().toHex() : undefined)])));
  } // retrieve a set of values for a specific set of keys - here we chunk the keys into PAGE_SIZE sizes


  _retrieveMulti(keys) {
    if (!keys.length) {
      return of([]);
    }

    const queryCall = this.hasSubscriptions ? this._rpcCore.state.subscribeStorage : this._rpcCore.state.queryStorageAt;
    return combineLatest(arrayChunk(keys, PAGE_SIZE_V).map(keys => queryCall(keys))).pipe(map(arrayFlatten));
  }

  _retrieveMapKeys({
    iterKey,
    meta,
    method,
    section
  }, at, args) {
    assert(iterKey && (meta.type.isMap || meta.type.isDoubleMap || meta.type.isNMap), 'keys can only be retrieved on maps, linked maps and double maps');
    const headKey = iterKey(...args).toHex();
    const startSubject = new BehaviorSubject(headKey);
    const queryCall = at ? startKey => this._rpcCore.state.getKeysPaged(headKey, PAGE_SIZE_K, startKey, at) : startKey => this._rpcCore.state.getKeysPaged(headKey, PAGE_SIZE_K, startKey);
    return startSubject.pipe(switchMap(queryCall), map(keys => keys.map(key => key.setMeta(meta, section, method))), tap(keys => {
      setTimeout(() => {
        keys.length === PAGE_SIZE_K ? startSubject.next(keys[PAGE_SIZE_K - 1].toHex()) : startSubject.complete();
      }, 0);
    }), toArray(), // toArray since we want to startSubject to be completed
    map(arrayFlatten));
  }

  _retrieveMapKeysPaged({
    iterKey,
    meta,
    method,
    section
  }, opts) {
    assert(iterKey && (meta.type.isMap || meta.type.isDoubleMap || meta.type.isNMap), 'keys can only be retrieved on maps, linked maps and double maps');
    const headKey = iterKey(...opts.args).toHex();
    return this._rpcCore.state.getKeysPaged(headKey, opts.pageSize, opts.startKey || headKey).pipe(map(keys => keys.map(key => key.setMeta(meta, section, method))));
  }

  _retrieveMapEntries(entry, at, args) {
    const query = at ? keyset => this._rpcCore.state.queryStorageAt(keyset, at) : keyset => this._rpcCore.state.queryStorageAt(keyset);
    return this._retrieveMapKeys(entry, at, args).pipe(switchMap(keys => keys.length ? combineLatest(arrayChunk(keys, PAGE_SIZE_V).map(query)).pipe(map(valsArr => arrayFlatten(valsArr).map((value, index) => [keys[index], value]))) : of([])));
  }

  _retrieveMapEntriesPaged(entry, opts) {
    return this._retrieveMapKeysPaged(entry, opts).pipe(switchMap(keys => keys.length ? this._rpcCore.state.queryStorageAt(keys).pipe(map(valsArr => valsArr.map((value, index) => [keys[index], value]))) : of([])));
  }

  _decorateDeriveRx(decorateMethod) {
    var _this$_runtimeVersion, _this$_options$typesB, _this$_options$typesB2, _this$_options$typesB3;

    const specName = (_this$_runtimeVersion = this._runtimeVersion) === null || _this$_runtimeVersion === void 0 ? void 0 : _this$_runtimeVersion.specName.toString();

    const derives = _objectSpread(_objectSpread({}, this._options.derives), ((_this$_options$typesB = this._options.typesBundle) === null || _this$_options$typesB === void 0 ? void 0 : (_this$_options$typesB2 = _this$_options$typesB.spec) === null || _this$_options$typesB2 === void 0 ? void 0 : (_this$_options$typesB3 = _this$_options$typesB2[specName !== null && specName !== void 0 ? specName : '']) === null || _this$_options$typesB3 === void 0 ? void 0 : _this$_options$typesB3.derives) || {}); // Pull in derive from api-derive


    const derive = decorateDerive(_classPrivateFieldLooseBase(this, _instanceId)[_instanceId], this._rx, derives);
    return decorateSections(derive, decorateMethod);
  }

  _decorateDerive(decorateMethod) {
    return decorateSections(this._rx.derive, decorateMethod);
  }
  /**
   * Put the `this.onCall` function of ApiRx here, because it is needed by
   * `api._rx`.
   */


}