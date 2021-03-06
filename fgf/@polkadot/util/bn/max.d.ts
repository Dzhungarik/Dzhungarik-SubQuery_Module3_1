/// <reference types="bn.js" />
import { BN } from './bn';
export declare function checkMaxMin(type: 'max' | 'min', items: BN[]): BN;
/**
 * @name bnMax
 * @summary Finds and returns the highest value in an array of BNs.
 * @example
 * <BR>
 *
 * ```javascript
 * import BN from 'bn.js';
 * import { bnMax } from '@polkadot/util';
 *
 * bnMax([new BN(1), new BN(3), new BN(2)]).toString(); // => '3'
 * ```
 */
export declare function bnMax(...items: BN[]): BN;
