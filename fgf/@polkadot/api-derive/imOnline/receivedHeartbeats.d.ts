import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { DeriveHeartbeats } from '../types';
/**
 * @description Return a boolean array indicating whether the passed accounts had received heartbeats in the current session
 */
export declare function receivedHeartbeats(instanceId: string, api: ApiInterfaceRx): () => Observable<DeriveHeartbeats>;
