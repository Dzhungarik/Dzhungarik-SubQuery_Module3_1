import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { DeriveStakingAccount } from '../types';
/**
 * @description From a list of stashes, fill in all the relevant staking details
 */
export declare function accounts(instanceId: string, api: ApiInterfaceRx): (accountIds: (Uint8Array | string)[]) => Observable<DeriveStakingAccount[]>;
/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
export declare function account(instanceId: string, api: ApiInterfaceRx): (accountId: Uint8Array | string) => Observable<DeriveStakingAccount>;
