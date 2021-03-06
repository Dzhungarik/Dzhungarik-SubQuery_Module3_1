import type { Option, Vec } from '../../codec';
import type { Text, Type } from '../../primitive';
import type { Codec, Registry } from '../../types';
declare type Arg = {
    type: Type;
} & Codec;
declare type Item = {
    type: {
        isDoubleMap: boolean;
        isMap: boolean;
        isNMap: boolean;
        isPlain: boolean;
        asDoubleMap: {
            key1: Text;
            key2: Text;
            value: Text;
        };
        asMap: {
            key: Text;
            value: Text;
        };
        asNMap: {
            keyVec: Text[];
            value: Text;
        };
        asPlain: Text;
    };
} & Codec;
declare type Storage = Option<{
    items: Vec<Item>;
} & Codec>;
declare type Call = {
    args: Vec<Arg>;
} & Codec;
declare type Calls = Option<Vec<Call>>;
declare type Event = {
    args: Vec<Type>;
} & Codec;
declare type Events = Option<Vec<Event>>;
declare type Module = {
    calls?: Calls;
    constants?: Vec<{
        type: Text;
    } & Codec>;
    events?: Events;
    storage?: Storage;
} & Codec;
interface ExtractionMetadata {
    modules: Vec<Module>;
}
/** @internal */
export declare function getUniqTypes(registry: Registry, meta: ExtractionMetadata, throwError: boolean): string[];
export {};
