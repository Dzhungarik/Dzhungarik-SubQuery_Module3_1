import type { MetadataLatest } from '../../../interfaces';
import type { Registry } from '../../../types';
import type { Storage } from '../types';
/** @internal */
export declare function decorateStorage(registry: Registry, { modules }: MetadataLatest, _metaVersion: number): Storage;
