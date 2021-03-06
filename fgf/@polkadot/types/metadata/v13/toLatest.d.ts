import type { MetadataLatest, MetadataV13 } from '../../interfaces/metadata';
import type { Registry } from '../../types';
/**
 * Convert the Metadata (which is an alias) to latest - effectively this _always_ get applied to the top-level &
 * most-recent metadata, since it allows us a chance to actually apply call and storage specific type aliasses
 * @internal
 **/
export declare function toLatest(registry: Registry, { extrinsic, modules }: MetadataV13, metaVersion: number): MetadataLatest;
