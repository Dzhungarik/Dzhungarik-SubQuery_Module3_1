export declare enum TypeDefInfo {
    BTreeMap = 0,
    BTreeSet = 1,
    Compact = 2,
    DoNotConstruct = 3,
    Enum = 4,
    HashMap = 5,
    Int = 6,
    Linkage = 7,
    Null = 8,
    Option = 9,
    Plain = 10,
    Range = 11,
    Result = 12,
    Set = 13,
    Si = 14,
    Struct = 15,
    Tuple = 16,
    UInt = 17,
    Vec = 18,
    VecFixed = 19
}
export interface TypeDef {
    alias?: Map<string, string>;
    displayName?: string;
    docs?: string[];
    fallbackType?: string;
    info: TypeDefInfo;
    index?: number;
    isFromSi?: boolean;
    length?: number;
    lookupIndex?: number;
    lookupName?: string;
    lookupNameRoot?: string;
    name?: string;
    namespace?: string;
    sub?: TypeDef | TypeDef[];
    type: string;
}
export interface CreateOptions {
    blockHash?: Uint8Array | string | null;
    isOptional?: boolean;
    isPedantic?: boolean;
}
