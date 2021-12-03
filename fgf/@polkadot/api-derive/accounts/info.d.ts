import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { DeriveAccountInfo } from '../types';
/**
 * @name info
 * @description Returns aux. info with regards to an account, current that includes the accountId, accountIndex and nickname
 */
export declare function info(instanceId: string, api: ApiInterfaceRx): (address?: AccountIndex | AccountId | Address | Uint8Array | string | null) => Observable<DeriveAccountInfo>;
