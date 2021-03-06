import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
// order important in structs... :)

/* eslint-disable sort-keys */
import { v0 } from "./v0.js";
import { v1 } from "./v1.js";
import { v2 } from "./v2.js";
const xcm = {
  XcmOrigin: {
    _enum: {
      Xcm: 'MultiLocation'
    }
  },
  Xcm: 'XcmV1',
  XcmpMessageFormat: {
    _enum: ['ConcatenatedVersionedXcm', 'ConcatenatedEncodedBlob', 'Signals']
  },
  XcmError: 'XcmErrorV1',
  XcmOrder: 'XcmOrderV1',
  XcmAssetId: {
    _enum: {
      Concrete: 'MultiLocation',
      Abstract: 'Bytes'
    }
  },
  AssetInstance: 'AssetInstanceV1',
  Fungibility: {
    _enum: {
      Fungible: 'u128',
      NonFungible: 'AssetInstance'
    }
  },
  InboundStatus: {
    _enum: ['Ok', 'Suspended']
  },
  OutboundStatus: {
    _enum: ['Ok', 'Suspended']
  },
  MultiAssetFilter: 'MultiAssetFilterV1',
  MultiAsset: 'MultiAssetV1',
  MultiAssets: 'Vec<MultiAsset>',
  WildFungibility: {
    _enum: ['Fungible', 'NonFungible']
  },
  WildMultiAsset: 'WildMultiAssetV1'
};
const location = {
  BodyId: {
    _enum: {
      Unit: 'Null',
      Named: 'Vec<u8>',
      Index: 'Compact<u32>',
      Executive: 'Null',
      Technical: 'Null',
      Legislative: 'Null',
      Judicial: 'Null'
    }
  },
  BodyPart: {
    _enum: {
      Voice: 'Null',
      Members: 'Compact<u32>',
      Fraction: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>'
      },
      AtLeastProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>'
      },
      MoreThanProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>'
      }
    }
  },
  InteriorMultiLocation: 'Junctions',
  Junction: 'JunctionV1',
  Junctions: 'JunctionsV1',
  MultiLocation: 'MultiLocationV1',
  NetworkId: {
    _enum: {
      Any: 'Null',
      Named: 'Vec<u8>',
      Polkadot: 'Null',
      Kusama: 'Null'
    }
  }
};
export default {
  rpc: {},
  types: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, location), xcm), v0), v1), v2), {}, {
    DoubleEncodedCall: {
      encoded: 'Vec<u8>'
    },
    XcmOriginKind: {
      _enum: ['Native', 'SovereignAccount', 'Superuser', 'Xcm']
    },
    Response: 'ResponseV1',
    Outcome: {
      _enum: {
        Complete: 'Weight',
        Incomplete: '(Weight, XcmErrorV0)',
        Error: 'XcmErrorV0'
      }
    },
    QueryId: 'u64',
    QueryStatus: {
      _enum: {
        Pending: {
          responder: 'VersionedMultiLocation',
          maybeNotify: 'Option<(u8, u8)>',
          timeout: 'BlockNumber'
        },
        Ready: {
          response: 'VersionedResponse',
          at: 'BlockNumber'
        }
      }
    },
    QueueConfigData: {
      suspendThreshold: 'u32',
      dropThreshold: 'u32',
      resumeThreshold: 'u32',
      thresholdWeight: 'Weight',
      weightRestrictDecay: 'Weight'
    },
    VersionMigrationStage: {
      _enum: {
        MigrateSupportedVersion: 'Null',
        MigrateVersionNotifiers: 'Null',
        NotifyCurrentTargets: 'Option<Bytes>',
        MigrateAndNotifyOldTargets: 'Null'
      }
    },
    VersionedMultiAsset: {
      _enum: {
        V0: 'MultiAssetV0',
        V1: 'MultiAssetV1',
        V2: 'MultiAssetV2'
      }
    },
    VersionedMultiAssets: {
      _enum: {
        V0: 'Vec<MultiAssetV0>',
        V1: 'MultiAssetsV1',
        V2: 'MultiAssetsV2'
      }
    },
    VersionedMultiLocation: {
      _enum: {
        V0: 'MultiLocationV0',
        V1: 'MultiLocationV1',
        V2: 'MultiLocationV2'
      }
    },
    VersionedResponse: {
      V0: 'ResponseV0',
      V1: 'ResponseV1',
      V2: 'ResponseV2'
    },
    VersionedXcm: {
      _enum: {
        V0: 'XcmV0',
        V1: 'XcmV1',
        V2: 'XcmV2'
      }
    },
    XcmVersion: 'u32'
  })
};