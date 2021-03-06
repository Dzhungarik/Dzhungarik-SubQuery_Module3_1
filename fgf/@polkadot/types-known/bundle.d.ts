/// <reference types="bn.js" />
import type { Text } from '@polkadot/types';
import type { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { ChainUpgradeVersion, CodecHasher, DefinitionRpc, DefinitionRpcSub, OverrideModuleType, Registry, RegistryTypes } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
export { knownOrigins } from './knownOrigins';
export { packageInfo } from './packageInfo';
/**
 * @description Get types for specific modules (metadata override)
 */
export declare function getModuleTypes({ knownTypes }: Registry, section: string): OverrideModuleType;
/**
 * @description Based on the chain and runtimeVersion, get the applicable signed extensions (ready for registration)
 */
export declare function getSpecExtensions({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): ExtDef;
/**
 * @description Based on the chain and runtimeVersion, get the applicable types (ready for registration)
 */
export declare function getSpecTypes({ knownTypes }: Registry, chainName: Text | string, specName: Text | string, specVersion: bigint | BN | number): RegistryTypes;
export declare function getSpecHasher({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): CodecHasher | null;
/**
 * @description Based on the chain and runtimeVersion, get the applicable rpc definitions (ready for registration)
 */
export declare function getSpecRpc({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>;
/**
 * @description Based on the chain and runtimeVersion, get the applicable alias definitions (ready for registration)
 */
export declare function getSpecAlias({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): Record<string, OverrideModuleType>;
/**
 * @description Returns a version record for known chains where upgrades are being tracked
 */
export declare function getUpgradeVersion(genesisHash: Hash, blockNumber: BN): [ChainUpgradeVersion | undefined, ChainUpgradeVersion | undefined];
