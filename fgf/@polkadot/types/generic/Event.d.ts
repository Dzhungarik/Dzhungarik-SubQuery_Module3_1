import type { TypeDef } from '../create/types';
import type { EventMetadataLatest } from '../interfaces/metadata';
import type { EventId } from '../interfaces/system';
import type { AnyJson, Codec, Constructor, IEvent, IEventData, Registry } from '../types';
import { Struct } from '../codec/Struct';
import { Tuple } from '../codec/Tuple';
/**
 * @name GenericEventData
 * @description
 * Wrapper for the actual data that forms part of an [[Event]]
 */
export declare class GenericEventData extends Tuple implements IEventData {
    #private;
    constructor(registry: Registry, value: Uint8Array, Types: Constructor<Codec>[] | undefined, typeDef: TypeDef[] | undefined, meta: EventMetadataLatest, section?: string, method?: string);
    /**
     * @description The wrapped [[EventMetadata]]
     */
    get meta(): EventMetadataLatest;
    /**
     * @description The method as a string
     */
    get method(): string;
    /**
     * @description The section as a string
     */
    get section(): string;
    /**
     * @description The [[TypeDef]] for this event
     */
    get typeDef(): TypeDef[];
}
/**
 * @name GenericEvent
 * @description
 * A representation of a system event. These are generated via the [[Metadata]] interfaces and
 * specific to a specific Substrate runtime
 */
export declare class GenericEvent extends Struct implements IEvent<Codec[]> {
    constructor(registry: Registry, _value?: Uint8Array);
    /**
     * @description The wrapped [[EventData]]
     */
    get data(): GenericEventData;
    /**
     * @description The [[EventId]], identifying the raw event
     */
    get index(): EventId;
    /**
     * @description The [[EventMetadata]] with the documentation
     */
    get meta(): EventMetadataLatest;
    /**
     * @description The method string identifying the event
     */
    get method(): string;
    /**
     * @description The section string identifying the event
     */
    get section(): string;
    /**
     * @description The [[TypeDef]] for the event
     */
    get typeDef(): TypeDef[];
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExpanded?: boolean): Record<string, AnyJson>;
}
