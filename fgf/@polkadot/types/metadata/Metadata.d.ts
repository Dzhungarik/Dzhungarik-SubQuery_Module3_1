import type { Registry } from '../types';
import { MetadataVersioned } from './MetadataVersioned';
/**
 * @name Metadata
 * @description
 * The versioned runtime metadata as a decoded structure
 */
export declare class Metadata extends MetadataVersioned {
    constructor(registry: Registry, value?: Uint8Array | string | Map<string, unknown> | Record<string, unknown>);
}
