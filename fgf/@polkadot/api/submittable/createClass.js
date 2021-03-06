import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-dupe-class-members */
import { catchError, first, map, mapTo, mergeMap, of, switchMap, tap } from 'rxjs';
import { assert, isBn, isFunction, isNumber, isString, isU8a } from '@polkadot/util';
import { filterEvents, isKeyringPair } from "../util/index.js";
import { SubmittableResult } from "./Result.js";

const identity = input => input;

export function createClass({
  api,
  apiType,
  decorateMethod
}) {
  // an instance of the base extrinsic for us to extend
  const ExtrinsicBase = api.registry.createClass('Extrinsic');

  var _ignoreStatusCb = /*#__PURE__*/_classPrivateFieldLooseKey("ignoreStatusCb");

  var _transformResult = /*#__PURE__*/_classPrivateFieldLooseKey("transformResult");

  var _makeEraOptions = /*#__PURE__*/_classPrivateFieldLooseKey("makeEraOptions");

  var _makeSignOptions = /*#__PURE__*/_classPrivateFieldLooseKey("makeSignOptions");

  var _makeSignAndSendOptions = /*#__PURE__*/_classPrivateFieldLooseKey("makeSignAndSendOptions");

  var _observeSign = /*#__PURE__*/_classPrivateFieldLooseKey("observeSign");

  var _observeStatus = /*#__PURE__*/_classPrivateFieldLooseKey("observeStatus");

  var _observeSend = /*#__PURE__*/_classPrivateFieldLooseKey("observeSend");

  var _observeSubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("observeSubscribe");

  var _optionsOrNonce = /*#__PURE__*/_classPrivateFieldLooseKey("optionsOrNonce");

  var _signViaSigner = /*#__PURE__*/_classPrivateFieldLooseKey("signViaSigner");

  var _updateSigner = /*#__PURE__*/_classPrivateFieldLooseKey("updateSigner");

  class Submittable extends ExtrinsicBase {
    constructor(registry, extrinsic) {
      super(registry, extrinsic, {
        version: api.extrinsicType
      });
      Object.defineProperty(this, _ignoreStatusCb, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _transformResult, {
        writable: true,
        value: identity
      });
      Object.defineProperty(this, _makeEraOptions, {
        writable: true,
        value: (options, {
          header,
          mortalLength,
          nonce
        }) => {
          if (!header) {
            if (isNumber(options.era)) {
              // since we have no header, it is immortal, remove any option overrides
              // so we only supply the genesisHash and no era to the construction
              delete options.era;
              delete options.blockHash;
            }

            return _classPrivateFieldLooseBase(this, _makeSignOptions)[_makeSignOptions](options, {
              nonce
            });
          }

          return _classPrivateFieldLooseBase(this, _makeSignOptions)[_makeSignOptions](options, {
            blockHash: header.hash,
            era: this.registry.createType('ExtrinsicEra', {
              current: header.number,
              period: options.era || mortalLength
            }),
            nonce
          });
        }
      });
      Object.defineProperty(this, _makeSignOptions, {
        writable: true,
        value: (options, extras) => {
          return _objectSpread(_objectSpread(_objectSpread({
            blockHash: api.genesisHash,
            genesisHash: api.genesisHash
          }, options), extras), {}, {
            runtimeVersion: api.runtimeVersion,
            signedExtensions: api.registry.signedExtensions,
            version: api.extrinsicType
          });
        }
      });
      Object.defineProperty(this, _makeSignAndSendOptions, {
        writable: true,
        value: (optionsOrStatus, statusCb) => {
          let options = {};

          if (isFunction(optionsOrStatus)) {
            statusCb = optionsOrStatus;
          } else {
            options = _objectSpread({}, optionsOrStatus);
          }

          return [options, statusCb];
        }
      });
      Object.defineProperty(this, _observeSign, {
        writable: true,
        value: (account, optionsOrNonce) => {
          const address = isKeyringPair(account) ? account.address : account.toString();

          const options = _classPrivateFieldLooseBase(this, _optionsOrNonce)[_optionsOrNonce](optionsOrNonce);

          let updateId;
          return api.derive.tx.signingInfo(address, options.nonce, options.era).pipe(first(), mergeMap(async signingInfo => {
            const eraOptions = _classPrivateFieldLooseBase(this, _makeEraOptions)[_makeEraOptions](options, signingInfo);

            if (isKeyringPair(account)) {
              this.sign(account, eraOptions);
            } else {
              updateId = await _classPrivateFieldLooseBase(this, _signViaSigner)[_signViaSigner](address, eraOptions, signingInfo.header);
            }
          }), mapTo(updateId));
        }
      });
      Object.defineProperty(this, _observeStatus, {
        writable: true,
        value: (hash, status) => {
          if (!status.isFinalized && !status.isInBlock) {
            return of(_classPrivateFieldLooseBase(this, _transformResult)[_transformResult](new SubmittableResult({
              status
            })));
          }

          const blockHash = status.isInBlock ? status.asInBlock : status.asFinalized;
          return api.derive.tx.events(blockHash).pipe(map(({
            block,
            events
          }) => _classPrivateFieldLooseBase(this, _transformResult)[_transformResult](new SubmittableResult({
            events: filterEvents(hash, block, events, status),
            status
          }))), catchError(internalError => of(_classPrivateFieldLooseBase(this, _transformResult)[_transformResult](new SubmittableResult({
            internalError,
            status
          })))));
        }
      });
      Object.defineProperty(this, _observeSend, {
        writable: true,
        value: (updateId = -1) => {
          return api.rpc.author.submitExtrinsic(this).pipe(tap(hash => {
            _classPrivateFieldLooseBase(this, _updateSigner)[_updateSigner](updateId, hash);
          }));
        }
      });
      Object.defineProperty(this, _observeSubscribe, {
        writable: true,
        value: (updateId = -1) => {
          const hash = this.hash;
          return api.rpc.author.submitAndWatchExtrinsic(this).pipe(switchMap(status => _classPrivateFieldLooseBase(this, _observeStatus)[_observeStatus](hash, status)), tap(status => {
            _classPrivateFieldLooseBase(this, _updateSigner)[_updateSigner](updateId, status);
          }));
        }
      });
      Object.defineProperty(this, _optionsOrNonce, {
        writable: true,
        value: (optionsOrNonce = {}) => {
          return isBn(optionsOrNonce) || isNumber(optionsOrNonce) ? {
            nonce: optionsOrNonce
          } : optionsOrNonce;
        }
      });
      Object.defineProperty(this, _signViaSigner, {
        writable: true,
        value: async (address, options, header) => {
          const signer = options.signer || api.signer;
          assert(signer, 'No signer specified, either via api.setSigner or via sign options. You possibly need to pass through an explicit keypair for the origin so it can be used for signing.');
          const payload = this.registry.createType('SignerPayload', _objectSpread(_objectSpread({}, options), {}, {
            address,
            blockNumber: header ? header.number : 0,
            method: this.method
          }));
          let result;

          if (signer.signPayload) {
            result = await signer.signPayload(payload.toPayload());
          } else if (signer.signRaw) {
            result = await signer.signRaw(payload.toRaw());
          } else {
            throw new Error('Invalid signer interface, it should implement either signPayload or signRaw (or both)');
          } // Here we explicitly call `toPayload()` again instead of working with an object
          // (reference) as passed to the signer. This means that we are sure that the
          // payload data is not modified from our inputs, but the signer


          super.addSignature(address, result.signature, payload.toPayload());
          return result.id;
        }
      });
      Object.defineProperty(this, _updateSigner, {
        writable: true,
        value: (updateId, status) => {
          if (updateId !== -1 && api.signer && api.signer.update) {
            api.signer.update(updateId, status);
          }
        }
      });
      _classPrivateFieldLooseBase(this, _ignoreStatusCb)[_ignoreStatusCb] = apiType === 'rxjs';
    } // dry run an extrinsic


    dryRun(account, optionsOrHash) {
      if (isString(optionsOrHash) || isU8a(optionsOrHash)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return decorateMethod(() => api.rpc.system.dryRun(this.toHex(), optionsOrHash));
      } // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call


      return decorateMethod(() => _classPrivateFieldLooseBase(this, _observeSign)[_observeSign](account, optionsOrHash).pipe(switchMap(() => api.rpc.system.dryRun(this.toHex()))))();
    } // calculate the payment info for this transaction (if signed and submitted)


    paymentInfo(account, optionsOrHash) {
      if (isString(optionsOrHash) || isU8a(optionsOrHash)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return decorateMethod(() => api.rpc.payment.queryInfo(this.toHex(), optionsOrHash));
      }

      const [allOptions] = _classPrivateFieldLooseBase(this, _makeSignAndSendOptions)[_makeSignAndSendOptions](optionsOrHash);

      const address = isKeyringPair(account) ? account.address : account.toString(); // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call

      return decorateMethod(() => api.derive.tx.signingInfo(address, allOptions.nonce, allOptions.era).pipe(first(), switchMap(signingInfo => {
        // setup our options (same way as in signAndSend)
        const eraOptions = _classPrivateFieldLooseBase(this, _makeEraOptions)[_makeEraOptions](allOptions, signingInfo);

        const signOptions = _classPrivateFieldLooseBase(this, _makeSignOptions)[_makeSignOptions](eraOptions, {});

        this.signFake(address, signOptions);
        return api.rpc.payment.queryInfo(this.toHex());
      })))();
    } // send with an immediate Hash result


    // send implementation for both immediate Hash and statusCb variants
    send(statusCb) {
      const isSubscription = api.hasSubscriptions && (_classPrivateFieldLooseBase(this, _ignoreStatusCb)[_ignoreStatusCb] || !!statusCb); // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call

      return decorateMethod(isSubscription ? _classPrivateFieldLooseBase(this, _observeSubscribe)[_observeSubscribe] : _classPrivateFieldLooseBase(this, _observeSend)[_observeSend])(statusCb);
    }
    /**
     * @description Sign a transaction, returning the this to allow chaining, i.e. .sign(...).send(). When options, e.g. nonce/blockHash are not specified, it will be inferred. To retrieve eg. nonce use `signAsync` (the preferred interface, this is provided for backwards compatibility)
     * @deprecated
     */


    sign(account, optionsOrNonce) {
      super.sign(account, _classPrivateFieldLooseBase(this, _makeSignOptions)[_makeSignOptions](_classPrivateFieldLooseBase(this, _optionsOrNonce)[_optionsOrNonce](optionsOrNonce), {}));
      return this;
    }
    /**
     * @description Signs a transaction, returning `this` to allow chaining. E.g.: `sign(...).send()`. Like `.signAndSend` this will retrieve the nonce and blockHash to send the tx with.
     */


    signAsync(account, optionsOrNonce) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
      return decorateMethod(() => _classPrivateFieldLooseBase(this, _observeSign)[_observeSign](account, optionsOrNonce).pipe(mapTo(this)))();
    } // signAndSend with an immediate Hash result


    // signAndSend implementation for all 3 cases above
    signAndSend(account, optionsOrStatus, optionalStatusCb) {
      const [options, statusCb] = _classPrivateFieldLooseBase(this, _makeSignAndSendOptions)[_makeSignAndSendOptions](optionsOrStatus, optionalStatusCb);

      const isSubscription = api.hasSubscriptions && (_classPrivateFieldLooseBase(this, _ignoreStatusCb)[_ignoreStatusCb] || !!statusCb); // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call

      return decorateMethod(() => _classPrivateFieldLooseBase(this, _observeSign)[_observeSign](account, options).pipe(switchMap(updateId => isSubscription ? _classPrivateFieldLooseBase(this, _observeSubscribe)[_observeSubscribe](updateId) : _classPrivateFieldLooseBase(this, _observeSend)[_observeSend](updateId))) // FIXME This is wrong, SubmittableResult is _not_ a codec
      )(statusCb);
    } // adds a transform to the result, applied before result is returned


    withResultTransform(transform) {
      _classPrivateFieldLooseBase(this, _transformResult)[_transformResult] = transform;
      return this;
    }

  }

  return Submittable;
}