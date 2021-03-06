"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeDefInfo = void 0;
// Copyright 2017-2021 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
let TypeDefInfo;
exports.TypeDefInfo = TypeDefInfo;

(function (TypeDefInfo) {
  TypeDefInfo[TypeDefInfo["BTreeMap"] = 0] = "BTreeMap";
  TypeDefInfo[TypeDefInfo["BTreeSet"] = 1] = "BTreeSet";
  TypeDefInfo[TypeDefInfo["Compact"] = 2] = "Compact";
  TypeDefInfo[TypeDefInfo["DoNotConstruct"] = 3] = "DoNotConstruct";
  TypeDefInfo[TypeDefInfo["Enum"] = 4] = "Enum";
  TypeDefInfo[TypeDefInfo["HashMap"] = 5] = "HashMap";
  TypeDefInfo[TypeDefInfo["Int"] = 6] = "Int";
  TypeDefInfo[TypeDefInfo["Linkage"] = 7] = "Linkage";
  TypeDefInfo[TypeDefInfo["Null"] = 8] = "Null";
  TypeDefInfo[TypeDefInfo["Option"] = 9] = "Option";
  TypeDefInfo[TypeDefInfo["Plain"] = 10] = "Plain";
  TypeDefInfo[TypeDefInfo["Range"] = 11] = "Range";
  TypeDefInfo[TypeDefInfo["Result"] = 12] = "Result";
  TypeDefInfo[TypeDefInfo["Set"] = 13] = "Set";
  TypeDefInfo[TypeDefInfo["Si"] = 14] = "Si";
  TypeDefInfo[TypeDefInfo["Struct"] = 15] = "Struct";
  TypeDefInfo[TypeDefInfo["Tuple"] = 16] = "Tuple";
  TypeDefInfo[TypeDefInfo["UInt"] = 17] = "UInt";
  TypeDefInfo[TypeDefInfo["Vec"] = 18] = "Vec";
  TypeDefInfo[TypeDefInfo["VecFixed"] = 19] = "VecFixed";
})(TypeDefInfo || (exports.TypeDefInfo = TypeDefInfo = {}));