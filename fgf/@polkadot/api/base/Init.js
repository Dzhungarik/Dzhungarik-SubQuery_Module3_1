import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { firstValueFrom, map, of, switchMap } from 'rxjs';
import { Metadata, TypeRegistry } from '@polkadot/types';
import { getSpecAlias, getSpecExtensions, getSpecHasher, getSpecRpc, getSpecTypes, getUpgradeVersion } from '@polkadot/types-known';
import { assert, BN_ZERO, logger, stringify, u8aEq, u8aToHex, u8aToU8a } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { detectedCapabilities } from "./capabilities.js";
import { Decorate } from "./Decorate.js";
const KEEPALIVE_INTERVAL = 10000;
const l = logger('api/init');

var _healthTimer = /*#__PURE__*/_classPrivateFieldLooseKey("healthTimer");

var _registries = /*#__PURE__*/_classPrivateFieldLooseKey("registries");

var _updateSub = /*#__PURE__*/_classPrivateFieldLooseKey("updateSub");

var _onProviderConnect = /*#__PURE__*/_classPrivateFieldLooseKey("onProviderConnect");

var _onProviderDisconnect = /*#__PURE__*/_classPrivateFieldLooseKey("onProviderDisconnect");

var _onProviderError = /*#__PURE__*/_classPrivateFieldLooseKey("onProviderError");

export class Init extends Decorate {
  constructor(options, type, decorateMethod) {
    super(options, type, decorateMethod); // all injected types added to the registry for overrides

    Object.defineProperty(this, _healthTimer, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _registries, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _updateSub, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _onProviderConnect, {
      writable: true,
      value: async () => {
        this._isConnected.next(true);

        this.emit('connected');

        try {
          const [hasMeta, cryptoReady] = await Promise.all([this._loadMeta(), this._options.initWasm === false ? Promise.resolve(true) : cryptoWaitReady()]);

          this._subscribeHealth();

          if (hasMeta && !this._isReady && cryptoReady) {
            this._isReady = true;
            this.emit('ready', this);
          }
        } catch (_error) {
          const error = new Error(`FATAL: Unable to initialize the API: ${_error.message}`);
          l.error(error);
          this.emit('error', error);
        }
      }
    });
    Object.defineProperty(this, _onProviderDisconnect, {
      writable: true,
      value: () => {
        this._isConnected.next(false);

        this._unsubscribeHealth();

        this.emit('disconnected');
      }
    });
    Object.defineProperty(this, _onProviderError, {
      writable: true,
      value: error => {
        this.emit('error', error);
      }
    });
    this.registry.setKnownTypes(options); // We only register the types (global) if this is not a cloned instance.
    // Do right up-front, so we get in the user types before we are actually
    // doing anything on-chain, this ensures we have the overrides in-place

    if (!options.source) {
      this.registerTypes(options.types);
    } else {
      _classPrivateFieldLooseBase(this, _registries)[_registries] = _classPrivateFieldLooseBase(options.source, _registries)[_registries];
    }

    this._rpc = this._decorateRpc(this._rpcCore, this._decorateMethod);
    this._rx.rpc = this._decorateRpc(this._rpcCore, this._rxDecorateMethod);

    if (this.supportMulti) {
      this._queryMulti = this._decorateMulti(this._decorateMethod);
      this._rx.queryMulti = this._decorateMulti(this._rxDecorateMethod);
    }

    this._rx.signer = options.signer;

    this._rpcCore.setRegistrySwap(blockHash => this.getBlockRegistry(blockHash));

    if (this.hasSubscriptions) {
      this._rpcCore.provider.on('disconnected', _classPrivateFieldLooseBase(this, _onProviderDisconnect)[_onProviderDisconnect]);

      this._rpcCore.provider.on('error', _classPrivateFieldLooseBase(this, _onProviderError)[_onProviderError]);

      this._rpcCore.provider.on('connected', _classPrivateFieldLooseBase(this, _onProviderConnect)[_onProviderConnect]);
    } else {
      l.warn('Api will be available in a limited mode since the provider does not support subscriptions');
    } // If the provider was instantiated earlier, and has already emitted a
    // 'connected' event, then the `on('connected')` won't fire anymore. To
    // cater for this case, we call manually `this._onProviderConnect`.


    if (this._rpcCore.provider.isConnected) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      _classPrivateFieldLooseBase(this, _onProviderConnect)[_onProviderConnect]();
    }
  }
  /**
   * @description Decorates a registry based on the runtime version
   */


  _initRegistry(registry, chain, version, metadata, chainProps) {
    registry.setChainProperties(chainProps || this.registry.getChainProperties());
    registry.setKnownTypes(this._options);
    registry.register(getSpecTypes(registry, chain, version.specName, version.specVersion));
    registry.setHasher(getSpecHasher(registry, chain, version.specName)); // for bundled types, pull through the aliases defined

    if (registry.knownTypes.typesBundle) {
      registry.knownTypes.typesAlias = getSpecAlias(registry, chain, version.specName);
    }

    registry.setMetadata(metadata, undefined, _objectSpread(_objectSpread({}, getSpecExtensions(registry, chain, version.specName)), this._options.signedExtensions || {}));
  }
  /**
   * @description Returns the default versioned registry
   */


  _getDefaultRegistry() {
    // get the default registry version
    const thisRegistry = _classPrivateFieldLooseBase(this, _registries)[_registries].find(({
      isDefault
    }) => isDefault);

    assert(thisRegistry, 'Initialization error, cannot find the default registry');
    return thisRegistry;
  }
  /**
   * @description Returns a decorated API instance at a specific point in time
   */


  async at(blockHash) {
    const u8aHash = u8aToU8a(blockHash);
    const registry = await this.getBlockRegistry(u8aHash); // always create a new decoration for this specific hash

    return this._createDecorated(registry, true, u8aHash).decoratedApi;
  }
  /**
   * @description Sets up a registry based on the block hash defined
   */


  async getBlockRegistry(blockHash) {
    const existingViaHash = _classPrivateFieldLooseBase(this, _registries)[_registries].find(({
      lastBlockHash
    }) => lastBlockHash && u8aEq(lastBlockHash, blockHash));

    if (existingViaHash) {
      return existingViaHash;
    } // ensure we have everything required


    assert(this._genesisHash && this._runtimeVersion, 'Cannot retrieve data on an uninitialized chain'); // We have to assume that on the RPC layer the calls used here does not call back into
    // the registry swap, so getHeader & getRuntimeVersion should not be historic

    const header = this.registry.createType('HeaderPartial', this._genesisHash.eq(blockHash) ? {
      number: BN_ZERO,
      parentHash: this._genesisHash
    } : await firstValueFrom(this._rpcCore.chain.getHeader.json(blockHash)));
    assert(!header.parentHash.isEmpty, 'Unable to retrieve header and parent from supplied hash'); // get the runtime version, either on-chain or via an known upgrade history

    const [firstVersion, lastVersion] = getUpgradeVersion(this._genesisHash, header.number);
    const version = this.registry.createType('RuntimeVersionPartial', firstVersion && (lastVersion || firstVersion.specVersion.eq(this._runtimeVersion.specVersion)) ? {
      specName: this._runtimeVersion.specName,
      specVersion: firstVersion.specVersion
    } : await firstValueFrom(this._rpcCore.state.getRuntimeVersion.json(header.parentHash))); // check for pre-existing registries. We also check specName, e.g. it
    // could be changed like in Westmint with upgrade from  shell -> westmint

    const existingViaVersion = _classPrivateFieldLooseBase(this, _registries)[_registries].find(({
      specName,
      specVersion
    }) => specName.eq(version.specName) && specVersion.eq(version.specVersion));

    if (existingViaVersion) {
      existingViaVersion.lastBlockHash = blockHash;
      return existingViaVersion;
    } // nothing has been found, construct new


    const registry = new TypeRegistry(blockHash);
    const metadata = new Metadata(registry, await firstValueFrom(this._rpcCore.state.getMetadata.raw(header.parentHash)));

    this._initRegistry(registry, this._runtimeChain, version, metadata); // add our new registry


    const result = {
      lastBlockHash: blockHash,
      metadata,
      registry,
      specName: version.specName,
      specVersion: version.specVersion
    };

    _classPrivateFieldLooseBase(this, _registries)[_registries].push(result); // TODO This could be useful for historic, disabled due to cross-looping, i.e. .at queries
    // this._detectCapabilities(registry, blockHash);


    return result;
  }

  async _loadMeta() {
    var _this$_options$source;

    // on re-connection to the same chain, we don't want to re-do everything from chain again
    if (this._isReady) {
      return true;
    }

    this._unsubscribeUpdates(); // only load from on-chain if we are not a clone (default path), alternatively
    // just use the values from the source instance provided


    [this._genesisHash, this._runtimeMetadata] = (_this$_options$source = this._options.source) !== null && _this$_options$source !== void 0 && _this$_options$source._isReady ? await this._metaFromSource(this._options.source) : await this._metaFromChain(this._options.metadata);
    return this._initFromMeta(this._runtimeMetadata);
  } // eslint-disable-next-line @typescript-eslint/require-await


  async _metaFromSource(source) {
    this._extrinsicType = source.extrinsicVersion;
    this._runtimeChain = source.runtimeChain;
    this._runtimeVersion = source.runtimeVersion;
    const methods = []; // manually build a list of all available methods in this RPC, we are
    // going to filter on it to align the cloned RPC without making a call

    Object.keys(source.rpc).forEach(section => {
      Object.keys(source.rpc[section]).forEach(method => {
        methods.push(`${section}_${method}`);
      });
    });

    this._filterRpc(methods, getSpecRpc(this.registry, source.runtimeChain, source.runtimeVersion.specName));

    return [source.genesisHash, source.runtimeMetadata];
  }

  _detectCapabilities(registry, blockHash) {
    firstValueFrom(detectedCapabilities(this._rx, blockHash)).then(types => {
      if (Object.keys(types).length) {
        registry.register(types);
        l.debug(() => `Capabilities detected${blockHash ? ` (${u8aToHex(u8aToU8a(blockHash))})` : ''}: ${stringify(types)}`);
      }
    }).catch(undefined);
    return true;
  } // subscribe to metadata updates, inject the types on changes


  _subscribeUpdates() {
    if (_classPrivateFieldLooseBase(this, _updateSub)[_updateSub] || !this.hasSubscriptions) {
      return;
    }

    _classPrivateFieldLooseBase(this, _updateSub)[_updateSub] = this._rpcCore.state.subscribeRuntimeVersion().pipe(switchMap(version => {
      var _this$_runtimeVersion;

      return (// only retrieve the metadata when the on-chain version has been changed
        (_this$_runtimeVersion = this._runtimeVersion) !== null && _this$_runtimeVersion !== void 0 && _this$_runtimeVersion.specVersion.eq(version.specVersion) ? of(false) : this._rpcCore.state.getMetadata().pipe(map(metadata => {
          l.log(`Runtime version updated to spec=${version.specVersion.toString()}, tx=${version.transactionVersion.toString()}`);
          this._runtimeMetadata = metadata;
          this._runtimeVersion = version;
          this._rx.runtimeVersion = version; // update the default registry version

          const thisRegistry = this._getDefaultRegistry(); // setup the data as per the current versions


          thisRegistry.metadata = metadata;
          thisRegistry.specVersion = version.specVersion; // clear the registry types to ensure that we override correctly

          this._initRegistry(thisRegistry.registry.init(), this._runtimeChain, version, metadata);

          this._injectMetadata(thisRegistry, false);

          return this._detectCapabilities(thisRegistry.registry);
        }))
      );
    })).subscribe();
  }

  async _metaFromChain(optMetadata) {
    const [genesisHash, runtimeVersion, chain, chainProps, rpcMethods, chainMetadata] = await Promise.all([firstValueFrom(this._rpcCore.chain.getBlockHash(0)), firstValueFrom(this._rpcCore.state.getRuntimeVersion()), firstValueFrom(this._rpcCore.system.chain()), firstValueFrom(this._rpcCore.system.properties()), firstValueFrom(this._rpcCore.rpc.methods()), optMetadata ? Promise.resolve(null) : firstValueFrom(this._rpcCore.state.getMetadata())]); // set our chain version & genesisHash as returned

    this._runtimeChain = chain;
    this._runtimeVersion = runtimeVersion;
    this._rx.runtimeVersion = runtimeVersion; // retrieve metadata, either from chain  or as pass-in via options

    const metadataKey = `${genesisHash.toHex() || '0x'}-${runtimeVersion.specVersion.toString()}`;
    const metadata = chainMetadata || (optMetadata && optMetadata[metadataKey] ? new Metadata(this.registry, optMetadata[metadataKey]) : await firstValueFrom(this._rpcCore.state.getMetadata())); // initializes the registry & RPC

    this._initRegistry(this.registry, chain, runtimeVersion, metadata, chainProps);

    this._filterRpc(rpcMethods.methods.map(t => t.toString()), getSpecRpc(this.registry, chain, runtimeVersion.specName));

    this._subscribeUpdates(); // setup the initial registry, when we have none


    if (!_classPrivateFieldLooseBase(this, _registries)[_registries].length) {
      _classPrivateFieldLooseBase(this, _registries)[_registries].push({
        isDefault: true,
        metadata,
        registry: this.registry,
        specName: runtimeVersion.specName,
        specVersion: runtimeVersion.specVersion
      });
    } // get unique types & validate


    metadata.getUniqTypes(this._options.throwOnUnknown || false);
    return [genesisHash, metadata];
  }

  _initFromMeta(metadata) {
    this._extrinsicType = metadata.asLatest.extrinsic.version.toNumber();
    this._rx.extrinsicType = this._extrinsicType;
    this._rx.genesisHash = this._genesisHash;
    this._rx.runtimeVersion = this._runtimeVersion; // must be set here
    // inject metadata and adjust the types as detected

    this._injectMetadata(this._getDefaultRegistry(), true); // derive is last, since it uses the decorated rx


    this._rx.derive = this._decorateDeriveRx(this._rxDecorateMethod);
    this._derive = this._decorateDerive(this._decorateMethod); // detect the on-chain capabilities

    this._detectCapabilities(this.registry);

    return true;
  }

  _subscribeHealth() {
    // Only enable the health keepalive on WS, not needed on HTTP
    _classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer] = this.hasSubscriptions ? setInterval(() => {
      firstValueFrom(this._rpcCore.system.health()).catch(() => undefined);
    }, KEEPALIVE_INTERVAL) : null;
  }

  _unsubscribeHealth() {
    if (_classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer]) {
      clearInterval(_classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer]);
      _classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer] = null;
    }
  }

  _unsubscribeUpdates() {
    if (_classPrivateFieldLooseBase(this, _updateSub)[_updateSub]) {
      _classPrivateFieldLooseBase(this, _updateSub)[_updateSub].unsubscribe();

      _classPrivateFieldLooseBase(this, _updateSub)[_updateSub] = null;
    }
  }

  _unsubscribe() {
    this._unsubscribeHealth();

    this._unsubscribeUpdates();
  }

}