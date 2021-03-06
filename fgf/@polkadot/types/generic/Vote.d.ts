import type { Conviction } from '../interfaces/democracy';
import type { AllConvictions } from '../interfaces/democracy/definitions';
import type { AnyJson, ArrayElementType, Registry } from '../types';
import { U8aFixed } from '../codec/U8aFixed';
interface VoteType {
    aye: boolean;
    conviction?: number | ArrayElementType<typeof AllConvictions>;
}
declare type InputTypes = boolean | number | Boolean | Uint8Array | VoteType;
/**
 * @name GenericVote
 * @description
 * A number of lock periods, plus a vote, one way or the other.
 */
export declare class GenericVote extends U8aFixed {
    private _aye;
    private _conviction;
    constructor(registry: Registry, value?: InputTypes);
    /**
     * @description returns a V2 conviction
     */
    get conviction(): Conviction;
    /**
     * @description true if the wrapped value is a positive vote
     */
    get isAye(): boolean;
    /**
     * @description true if the wrapped value is a negative vote
     */
    get isNay(): boolean;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExpanded?: boolean): AnyJson;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
export {};
