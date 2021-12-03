import { Token, Type } from './token.js'
import { assertEnoughData, decodeErrPrefix } from './common.js'
import * as uint from './0uint.js'
import { encodeBytes } from './2bytes.js'
import { toString } from './byte-utils.js'

/**
 * @typedef {import('./bl.js').Bl} Bl
 * @typedef {import('../interface').DecodeOptions} DecodeOptions
 */

/**
 * @param {Uint8Array} data
 * @param {number} pos
 * @param {number} prefix
 * @param {number} length
 * @returns {Token}
 */
function toToken (data, pos, prefix, length) {
  const totLength = prefix + length
  assertEnoughData(data, pos, totLength)
  return new Token(Type.string, toString(data, pos + prefix, pos + totLength), totLength)
}

/**
 * @param {Uint8Array} data
 * @param {number} pos
 * @param {number} minor
 * @param {DecodeOptions} _options
 * @returns {Token}
 */
export function decodeStringCompact (data, pos, minor, _options) {
  return toToken(data, pos, 1, minor)
}

/**
 * @param {Uint8Array} data
 * @param {number} pos
 * @param {number} _minor
 * @param {DecodeOptions} options
 * @returns {Token}
 */
export function decodeString8 (data, pos, _minor, options) {
  return toToken(data, pos, 2, uint.readUint8(data, pos + 1, options))
}

/**
 * @param {Uint8Array} data
 * @param {number} pos
 * @param {number} _minor
 * @param {DecodeOptions} options
 * @returns {Token}
 */
export function decodeString16 (data, pos, _minor, options) {
  return toToken(data, pos, 3, uint.readUint16(data, pos + 1, options))
}

/**
 * @param {Uint8Array} data
 * @param {number} pos
 * @param {number} _minor
 * @param {DecodeOptions} options
 * @returns {Token}
 */
export function decodeString32 (data, pos, _minor, options) {
  return toToken(data, pos, 5, uint.readUint32(data, pos + 1, options))
}

// TODO: maybe we shouldn't support this ..
/**
 * @param {Uint8Array} data
 * @param {number} pos
 * @param {number} _minor
 * @param {DecodeOptions} options
 * @returns {Token}
 */
export function decodeString64 (data, pos, _minor, options) {
  const l = uint.readUint64(data, pos + 1, options)
  if (typeof l === 'bigint') {
    throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`)
  }
  return toToken(data, pos, 9, l)
}

export const encodeString = encodeBytes
