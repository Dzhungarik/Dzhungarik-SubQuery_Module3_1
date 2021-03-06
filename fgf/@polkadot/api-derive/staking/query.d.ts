import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { DeriveStakingQuery, StakingQueryFlags } from '../types';
/**
 * @description From a stash, retrieve the controllerId and all relevant details
 */
export declare function query(instanceId: string, api: ApiInterfaceRx): (accountId: Uint8Array | string, flags: StakingQueryFlags) => Observable<DeriveStakingQuery>;
export declare function queryMulti(instanceId: string, api: ApiInterfaceRx): (accountIds: (Uint8Array | string)[], flags: StakingQueryFlags) => Observable<DeriveStakingQuery[]>;
