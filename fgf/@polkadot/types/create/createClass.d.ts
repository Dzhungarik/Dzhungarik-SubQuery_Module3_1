import type { Codec, Constructor, DetectConstructor, Registry } from '../types';
import type { TypeDef } from './types';
export declare function getTypeClass<T extends Codec = Codec>(registry: Registry, typeDef: TypeDef): Constructor<T>;
export declare function createClass<T extends Codec = Codec, K extends string = string>(registry: Registry, type: K): DetectConstructor<T, K>;
