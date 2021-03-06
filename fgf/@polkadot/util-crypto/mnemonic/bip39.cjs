"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entropyToMnemonic = entropyToMnemonic;
exports.generateMnemonic = generateMnemonic;
exports.mnemonicToEntropy = mnemonicToEntropy;
exports.mnemonicToSeedSync = mnemonicToSeedSync;
exports.validateMnemonic = validateMnemonic;

var _util = require("@polkadot/util");

var _index = require("../pbkdf2/index.cjs");

var _index2 = require("../random/index.cjs");

var _index3 = require("../sha/index.cjs");

var _bip39En = _interopRequireDefault(require("./bip39-en.cjs"));

// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Adapted from the bitcoinjs/bip39 source
// https://github.com/bitcoinjs/bip39/blob/1d063b6a6aee4145b34d701037cd3e67f5446ff9/ts_src/index.ts
// Copyright (c) 2014, Wei Lu <luwei.here@gmail.com> and Daniel Cousens <email@dcousens.com>
// ISC Licence
//
// Change made in this version -
//   - Adjust formatting (just eslint differences)
//   - Only English wordlist (this aligns with the wasm-crypto implementation)
//   - Use util-crypto randomAsU8a (instead of randombytes)
//   - Remove setting of wordlist passing of wordlist in functions
//   - Remove mnemonicToSeed (we only use the sync variant)
const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';

function normalize(str) {
  return (str || '').normalize('NFKD');
}

function binaryToByte(bin) {
  return parseInt(bin, 2);
}

function bytesToBinary(bytes) {
  return bytes.map(x => x.toString(2).padStart(8, '0')).join('');
}

function deriveChecksumBits(entropyBuffer) {
  return bytesToBinary(Array.from((0, _index3.sha256AsU8a)(entropyBuffer))).slice(0, entropyBuffer.length * 8 / 32);
}

function mnemonicToSeedSync(mnemonic, password) {
  return (0, _index.pbkdf2Encode)((0, _util.stringToU8a)(normalize(mnemonic)), (0, _util.stringToU8a)(`mnemonic${normalize(password)}`)).password;
}

function mnemonicToEntropy(mnemonic) {
  var _entropyBits$match;

  const words = normalize(mnemonic).split(' ');
  (0, _util.assert)(words.length % 3 === 0, INVALID_MNEMONIC); // convert word indices to 11 bit binary strings

  const bits = words.map(word => {
    const index = _bip39En.default.indexOf(word);

    (0, _util.assert)(index !== -1, INVALID_MNEMONIC);
    return index.toString(2).padStart(11, '0');
  }).join(''); // split the binary string into ENT/CS

  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex); // calculate the checksum and compare

  const entropyBytes = (_entropyBits$match = entropyBits.match(/(.{1,8})/g)) === null || _entropyBits$match === void 0 ? void 0 : _entropyBits$match.map(binaryToByte);
  (0, _util.assert)(entropyBytes && entropyBytes.length % 4 === 0 && entropyBytes.length >= 16 && entropyBytes.length <= 32, INVALID_ENTROPY);
  const entropy = (0, _util.u8aToU8a)(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  (0, _util.assert)(newChecksum === checksumBits, INVALID_CHECKSUM);
  return entropy;
}

function entropyToMnemonic(entropy) {
  // 128 <= ENT <= 256
  (0, _util.assert)(entropy.length % 4 === 0 && entropy.length >= 16 && entropy.length <= 32, INVALID_ENTROPY);
  const entropyBits = bytesToBinary(Array.from(entropy));
  const checksumBits = deriveChecksumBits(entropy); // we just set it prior, so this is a safe check
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  return (entropyBits + checksumBits).match(/(.{1,11})/g).map(binary => _bip39En.default[binaryToByte(binary)]).join(' ');
}

function generateMnemonic(strength) {
  strength = strength || 128;
  (0, _util.assert)(strength % 32 === 0, INVALID_ENTROPY);
  return entropyToMnemonic((0, _index2.randomAsU8a)(strength / 8));
}

function validateMnemonic(mnemonic) {
  try {
    mnemonicToEntropy(mnemonic);
  } catch (e) {
    return false;
  }

  return true;
}