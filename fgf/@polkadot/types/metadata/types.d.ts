import type { Vec } from '../codec';
import type { Codec } from '../types';
export interface MetadataInterface<Modules extends Codec> extends Codec {
    modules: Vec<Modules>;
}
