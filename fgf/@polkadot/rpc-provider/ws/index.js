import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/rpc-provider authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */
import EventEmitter from 'eventemitter3';
import { assert, isChildClass, isNull, isUndefined, logger } from '@polkadot/util';
import { xglobal } from '@polkadot/x-global';
import { WebSocket } from '@polkadot/x-ws';
import { RpcCoder } from "../coder/index.js";
import defaults from "../defaults.js";
import { getWSErrorString } from "./errors.js";
const ALIASES = {
  chain_finalisedHead: 'chain_finalizedHead',
  chain_subscribeFinalisedHeads: 'chain_subscribeFinalizedHeads',
  chain_unsubscribeFinalisedHeads: 'chain_unsubscribeFinalizedHeads'
};
const RETRY_DELAY = 2500;
const l = logger('api-ws');

function eraseRecord(record, cb) {
  Object.keys(record).forEach(key => {
    if (cb) {
      cb(record[key]);
    }

    delete record[key];
  });
}
/**
 * # @polkadot/rpc-provider/ws
 *
 * @name WsProvider
 *
 * @description The WebSocket Provider allows sending requests using WebSocket to a WebSocket RPC server TCP port. Unlike the [[HttpProvider]], it does support subscriptions and allows listening to events such as new blocks or balance changes.
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Api from '@polkadot/api/promise';
 * import { WsProvider } from '@polkadot/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const api = new Api(provider);
 * ```
 *
 * @see [[HttpProvider]]
 */


var _coder = /*#__PURE__*/_classPrivateFieldLooseKey("coder");

var _endpoints = /*#__PURE__*/_classPrivateFieldLooseKey("endpoints");

var _headers = /*#__PURE__*/_classPrivateFieldLooseKey("headers");

var _eventemitter = /*#__PURE__*/_classPrivateFieldLooseKey("eventemitter");

var _handlers = /*#__PURE__*/_classPrivateFieldLooseKey("handlers");

var _isReadyPromise = /*#__PURE__*/_classPrivateFieldLooseKey("isReadyPromise");

var _waitingForId = /*#__PURE__*/_classPrivateFieldLooseKey("waitingForId");

var _autoConnectMs = /*#__PURE__*/_classPrivateFieldLooseKey("autoConnectMs");

var _endpointIndex = /*#__PURE__*/_classPrivateFieldLooseKey("endpointIndex");

var _isConnected = /*#__PURE__*/_classPrivateFieldLooseKey("isConnected");

var _subscriptions = /*#__PURE__*/_classPrivateFieldLooseKey("subscriptions");

var _websocket = /*#__PURE__*/_classPrivateFieldLooseKey("websocket");

var _emit = /*#__PURE__*/_classPrivateFieldLooseKey("emit");

var _onSocketClose = /*#__PURE__*/_classPrivateFieldLooseKey("onSocketClose");

var _onSocketError = /*#__PURE__*/_classPrivateFieldLooseKey("onSocketError");

var _onSocketMessage = /*#__PURE__*/_classPrivateFieldLooseKey("onSocketMessage");

var _onSocketMessageResult = /*#__PURE__*/_classPrivateFieldLooseKey("onSocketMessageResult");

var _onSocketMessageSubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("onSocketMessageSubscribe");

var _onSocketOpen = /*#__PURE__*/_classPrivateFieldLooseKey("onSocketOpen");

var _resubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("resubscribe");

export class WsProvider {
  /**
   * @param {string | string[]}  endpoint    The endpoint url. Usually `ws://ip:9944` or `wss://ip:9944`, may provide an array of endpoint strings.
   * @param {boolean} autoConnect Whether to connect automatically or not.
   */
  constructor(endpoint = defaults.WS_URL, autoConnectMs = RETRY_DELAY, headers = {}) {
    Object.defineProperty(this, _coder, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _endpoints, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _headers, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _eventemitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handlers, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _isReadyPromise, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _waitingForId, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _autoConnectMs, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _endpointIndex, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isConnected, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _subscriptions, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _websocket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emit, {
      writable: true,
      value: (type, ...args) => {
        _classPrivateFieldLooseBase(this, _eventemitter)[_eventemitter].emit(type, ...args);
      }
    });
    Object.defineProperty(this, _onSocketClose, {
      writable: true,
      value: event => {
        const error = new Error(`disconnected from ${_classPrivateFieldLooseBase(this, _endpoints)[_endpoints][_classPrivateFieldLooseBase(this, _endpointIndex)[_endpointIndex]]}: ${event.code}:: ${event.reason || getWSErrorString(event.code)}`);

        if (_classPrivateFieldLooseBase(this, _autoConnectMs)[_autoConnectMs] > 0) {
          l.error(error.message);
        }

        _classPrivateFieldLooseBase(this, _isConnected)[_isConnected] = false;

        if (_classPrivateFieldLooseBase(this, _websocket)[_websocket]) {
          _classPrivateFieldLooseBase(this, _websocket)[_websocket].onclose = null;
          _classPrivateFieldLooseBase(this, _websocket)[_websocket].onerror = null;
          _classPrivateFieldLooseBase(this, _websocket)[_websocket].onmessage = null;
          _classPrivateFieldLooseBase(this, _websocket)[_websocket].onopen = null;
          _classPrivateFieldLooseBase(this, _websocket)[_websocket] = null;
        }

        _classPrivateFieldLooseBase(this, _emit)[_emit]('disconnected'); // reject all hanging requests


        eraseRecord(_classPrivateFieldLooseBase(this, _handlers)[_handlers], h => h.callback(error, undefined));
        eraseRecord(_classPrivateFieldLooseBase(this, _waitingForId)[_waitingForId]);

        if (_classPrivateFieldLooseBase(this, _autoConnectMs)[_autoConnectMs] > 0) {
          setTimeout(() => {
            this.connectWithRetry().catch(() => {// does not throw
            });
          }, _classPrivateFieldLooseBase(this, _autoConnectMs)[_autoConnectMs]);
        }
      }
    });
    Object.defineProperty(this, _onSocketError, {
      writable: true,
      value: error => {
        l.debug(() => ['socket error', error]);

        _classPrivateFieldLooseBase(this, _emit)[_emit]('error', error);
      }
    });
    Object.defineProperty(this, _onSocketMessage, {
      writable: true,
      value: message => {
        l.debug(() => ['received', message.data]);
        const response = JSON.parse(message.data);
        return isUndefined(response.method) ? _classPrivateFieldLooseBase(this, _onSocketMessageResult)[_onSocketMessageResult](response) : _classPrivateFieldLooseBase(this, _onSocketMessageSubscribe)[_onSocketMessageSubscribe](response);
      }
    });
    Object.defineProperty(this, _onSocketMessageResult, {
      writable: true,
      value: response => {
        const handler = _classPrivateFieldLooseBase(this, _handlers)[_handlers][response.id];

        if (!handler) {
          l.debug(() => `Unable to find handler for id=${response.id}`);
          return;
        }

        try {
          const {
            method,
            params,
            subscription
          } = handler;

          const result = _classPrivateFieldLooseBase(this, _coder)[_coder].decodeResponse(response); // first send the result - in case of subs, we may have an update
          // immediately if we have some queued results already


          handler.callback(null, result);

          if (subscription) {
            const subId = `${subscription.type}::${result}`;
            _classPrivateFieldLooseBase(this, _subscriptions)[_subscriptions][subId] = _objectSpread(_objectSpread({}, subscription), {}, {
              method,
              params
            }); // if we have a result waiting for this subscription already

            if (_classPrivateFieldLooseBase(this, _waitingForId)[_waitingForId][subId]) {
              _classPrivateFieldLooseBase(this, _onSocketMessageSubscribe)[_onSocketMessageSubscribe](_classPrivateFieldLooseBase(this, _waitingForId)[_waitingForId][subId]);
            }
          }
        } catch (error) {
          handler.callback(error, undefined);
        }

        delete _classPrivateFieldLooseBase(this, _handlers)[_handlers][response.id];
      }
    });
    Object.defineProperty(this, _onSocketMessageSubscribe, {
      writable: true,
      value: response => {
        const method = ALIASES[response.method] || response.method || 'invalid';
        const subId = `${method}::${response.params.subscription}`;

        const handler = _classPrivateFieldLooseBase(this, _subscriptions)[_subscriptions][subId];

        if (!handler) {
          // store the JSON, we could have out-of-order subid coming in
          _classPrivateFieldLooseBase(this, _waitingForId)[_waitingForId][subId] = response;
          l.debug(() => `Unable to find handler for subscription=${subId}`);
          return;
        } // housekeeping


        delete _classPrivateFieldLooseBase(this, _waitingForId)[_waitingForId][subId];

        try {
          const result = _classPrivateFieldLooseBase(this, _coder)[_coder].decodeResponse(response);

          handler.callback(null, result);
        } catch (error) {
          handler.callback(error, undefined);
        }
      }
    });
    Object.defineProperty(this, _onSocketOpen, {
      writable: true,
      value: () => {
        assert(!isNull(_classPrivateFieldLooseBase(this, _websocket)[_websocket]), 'WebSocket cannot be null in onOpen');
        l.debug(() => ['connected to', _classPrivateFieldLooseBase(this, _endpoints)[_endpoints][_classPrivateFieldLooseBase(this, _endpointIndex)[_endpointIndex]]]);
        _classPrivateFieldLooseBase(this, _isConnected)[_isConnected] = true;

        _classPrivateFieldLooseBase(this, _emit)[_emit]('connected');

        _classPrivateFieldLooseBase(this, _resubscribe)[_resubscribe]();

        return true;
      }
    });
    Object.defineProperty(this, _resubscribe, {
      writable: true,
      value: () => {
        const subscriptions = _classPrivateFieldLooseBase(this, _subscriptions)[_subscriptions];

        _classPrivateFieldLooseBase(this, _subscriptions)[_subscriptions] = {};
        Promise.all(Object.keys(subscriptions).map(async id => {
          const {
            callback,
            method,
            params,
            type
          } = subscriptions[id]; // only re-create subscriptions which are not in author (only area where
          // transactions are created, i.e. submissions such as 'author_submitAndWatchExtrinsic'
          // are not included (and will not be re-broadcast)

          if (type.startsWith('author_')) {
            return;
          }

          try {
            await this.subscribe(type, method, params, callback);
          } catch (error) {
            l.error(error);
          }
        })).catch(l.error);
      }
    });
    const endpoints = Array.isArray(endpoint) ? endpoint : [endpoint];
    assert(endpoints.length !== 0, 'WsProvider requires at least one Endpoint');
    endpoints.forEach(endpoint => {
      assert(/^(wss|ws):\/\//.test(endpoint), () => `Endpoint should start with 'ws://', received '${endpoint}'`);
    });
    _classPrivateFieldLooseBase(this, _eventemitter)[_eventemitter] = new EventEmitter();
    _classPrivateFieldLooseBase(this, _autoConnectMs)[_autoConnectMs] = autoConnectMs || 0;
    _classPrivateFieldLooseBase(this, _coder)[_coder] = new RpcCoder();
    _classPrivateFieldLooseBase(this, _endpointIndex)[_endpointIndex] = -1;
    _classPrivateFieldLooseBase(this, _endpoints)[_endpoints] = endpoints;
    _classPrivateFieldLooseBase(this, _headers)[_headers] = headers;
    _classPrivateFieldLooseBase(this, _websocket)[_websocket] = null;

    if (autoConnectMs > 0) {
      this.connectWithRetry().catch(() => {// does not throw
      });
    }

    _classPrivateFieldLooseBase(this, _isReadyPromise)[_isReadyPromise] = new Promise(resolve => {
      _classPrivateFieldLooseBase(this, _eventemitter)[_eventemitter].once('connected', () => {
        resolve(this);
      });
    });
  }
  /**
   * @summary `true` when this provider supports subscriptions
   */


  get hasSubscriptions() {
    return true;
  }
  /**
   * @summary Whether the node is connected or not.
   * @return {boolean} true if connected
   */


  get isConnected() {
    return _classPrivateFieldLooseBase(this, _isConnected)[_isConnected];
  }
  /**
   * @description Promise that resolves the first time we are connected and loaded
   */


  get isReady() {
    return _classPrivateFieldLooseBase(this, _isReadyPromise)[_isReadyPromise];
  }
  /**
   * @description Returns a clone of the object
   */


  clone() {
    return new WsProvider(_classPrivateFieldLooseBase(this, _endpoints)[_endpoints]);
  }
  /**
   * @summary Manually connect
   * @description The [[WsProvider]] connects automatically by default, however if you decided otherwise, you may
   * connect manually using this method.
   */
  // eslint-disable-next-line @typescript-eslint/require-await


  async connect() {
    try {
      _classPrivateFieldLooseBase(this, _endpointIndex)[_endpointIndex] = (_classPrivateFieldLooseBase(this, _endpointIndex)[_endpointIndex] + 1) % _classPrivateFieldLooseBase(this, _endpoints)[_endpoints].length;
      _classPrivateFieldLooseBase(this, _websocket)[_websocket] = typeof xglobal.WebSocket !== 'undefined' && isChildClass(xglobal.WebSocket, WebSocket) ? new WebSocket(_classPrivateFieldLooseBase(this, _endpoints)[_endpoints][_classPrivateFieldLooseBase(this, _endpointIndex)[_endpointIndex]]) // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - WS may be an instance of w3cwebsocket, which supports headers
      : new WebSocket(_classPrivateFieldLooseBase(this, _endpoints)[_endpoints][_classPrivateFieldLooseBase(this, _endpointIndex)[_endpointIndex]], undefined, undefined, _classPrivateFieldLooseBase(this, _headers)[_headers], undefined, {
        // default: true
        fragmentOutgoingMessages: true,
        // default: 16K (bump, the Node has issues with too many fragments, e.g. on setCode)
        fragmentationThreshold: 256 * 1024,
        // default: 8MB (however Polkadot api.query.staking.erasStakers.entries(356) is over that)
        maxReceivedMessageSize: 16 * 1024 * 1024
      });
      _classPrivateFieldLooseBase(this, _websocket)[_websocket].onclose = _classPrivateFieldLooseBase(this, _onSocketClose)[_onSocketClose];
      _classPrivateFieldLooseBase(this, _websocket)[_websocket].onerror = _classPrivateFieldLooseBase(this, _onSocketError)[_onSocketError];
      _classPrivateFieldLooseBase(this, _websocket)[_websocket].onmessage = _classPrivateFieldLooseBase(this, _onSocketMessage)[_onSocketMessage];
      _classPrivateFieldLooseBase(this, _websocket)[_websocket].onopen = _classPrivateFieldLooseBase(this, _onSocketOpen)[_onSocketOpen];
    } catch (error) {
      l.error(error);

      _classPrivateFieldLooseBase(this, _emit)[_emit]('error', error);

      throw error;
    }
  }
  /**
   * @description Connect, never throwing an error, but rather forcing a retry
   */


  async connectWithRetry() {
    if (_classPrivateFieldLooseBase(this, _autoConnectMs)[_autoConnectMs] > 0) {
      try {
        await this.connect();
      } catch (error) {
        setTimeout(() => {
          this.connectWithRetry().catch(() => {// does not throw
          });
        }, _classPrivateFieldLooseBase(this, _autoConnectMs)[_autoConnectMs]);
      }
    }
  }
  /**
   * @description Manually disconnect from the connection, clearing auto-connect logic
   */
  // eslint-disable-next-line @typescript-eslint/require-await


  async disconnect() {
    // switch off autoConnect, we are in manual mode now
    _classPrivateFieldLooseBase(this, _autoConnectMs)[_autoConnectMs] = 0;

    try {
      if (_classPrivateFieldLooseBase(this, _websocket)[_websocket]) {
        // 1000 - Normal closure; the connection successfully completed
        _classPrivateFieldLooseBase(this, _websocket)[_websocket].close(1000);
      }
    } catch (error) {
      l.error(error);

      _classPrivateFieldLooseBase(this, _emit)[_emit]('error', error);

      throw error;
    }
  }
  /**
   * @summary Listens on events after having subscribed using the [[subscribe]] function.
   * @param  {ProviderInterfaceEmitted} type Event
   * @param  {ProviderInterfaceEmitCb}  sub  Callback
   * @return unsubscribe function
   */


  on(type, sub) {
    _classPrivateFieldLooseBase(this, _eventemitter)[_eventemitter].on(type, sub);

    return () => {
      _classPrivateFieldLooseBase(this, _eventemitter)[_eventemitter].removeListener(type, sub);
    };
  }
  /**
   * @summary Send JSON data using WebSockets to configured HTTP Endpoint or queue.
   * @param method The RPC methods to execute
   * @param params Encoded parameters as applicable for the method
   * @param subscription Subscription details (internally used)
   */


  send(method, params, subscription) {
    return new Promise((resolve, reject) => {
      try {
        assert(this.isConnected && !isNull(_classPrivateFieldLooseBase(this, _websocket)[_websocket]), 'WebSocket is not connected');

        const json = _classPrivateFieldLooseBase(this, _coder)[_coder].encodeJson(method, params);

        const id = _classPrivateFieldLooseBase(this, _coder)[_coder].getId();

        const callback = (error, result) => {
          error ? reject(error) : resolve(result);
        };

        l.debug(() => ['calling', method, json]);
        _classPrivateFieldLooseBase(this, _handlers)[_handlers][id] = {
          callback,
          method,
          params,
          subscription
        };

        _classPrivateFieldLooseBase(this, _websocket)[_websocket].send(json);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * @name subscribe
   * @summary Allows subscribing to a specific event.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * const provider = new WsProvider('ws://127.0.0.1:9944');
   * const rpc = new Rpc(provider);
   *
   * rpc.state.subscribeStorage([[storage.system.account, <Address>]], (_, values) => {
   *   console.log(values)
   * }).then((subscriptionId) => {
   *   console.log('balance changes subscription id: ', subscriptionId)
   * })
   * ```
   */


  subscribe(type, method, params, callback) {
    return this.send(method, params, {
      callback,
      type
    });
  }
  /**
   * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
   */


  async unsubscribe(type, method, id) {
    const subscription = `${type}::${id}`; // FIXME This now could happen with re-subscriptions. The issue is that with a re-sub
    // the assigned id now does not match what the API user originally received. It has
    // a slight complication in solving - since we cannot rely on the send id, but rather
    // need to find the actual subscription id to map it

    if (isUndefined(_classPrivateFieldLooseBase(this, _subscriptions)[_subscriptions][subscription])) {
      l.debug(() => `Unable to find active subscription=${subscription}`);
      return false;
    }

    delete _classPrivateFieldLooseBase(this, _subscriptions)[_subscriptions][subscription];

    try {
      return this.isConnected && !isNull(_classPrivateFieldLooseBase(this, _websocket)[_websocket]) ? this.send(method, [id]) : true;
    } catch (error) {
      return false;
    }
  }

}