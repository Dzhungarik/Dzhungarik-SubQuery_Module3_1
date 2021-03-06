import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { DeriveAccountRegistration, DeriveHasIdentity } from '../types';
/**
 * @name identity
 * @description Returns identity info for an account
 */
export declare function identity(instanceId: string, api: ApiInterfaceRx): (accountId?: AccountId | Uint8Array | string) => Observable<DeriveAccountRegistration>;
export declare function hasIdentity(instanceId: string, api: ApiInterfaceRx): (accountId: AccountId | Uint8Array | string) => Observable<DeriveHasIdentity>;
export declare function hasIdentityMulti(instanceId: string, api: ApiInterfaceRx): (accountIds: (AccountId | Uint8Array | string)[]) => Observable<DeriveHasIdentity[]>;
