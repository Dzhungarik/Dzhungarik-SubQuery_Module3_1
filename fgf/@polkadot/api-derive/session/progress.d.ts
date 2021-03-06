import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { DeriveSessionProgress } from '../types';
/**
 * @description Retrieves all the session and era query and calculates specific values on it as the length of the session and eras
 */
export declare function progress(instanceId: string, api: ApiInterfaceRx): () => Observable<DeriveSessionProgress>;
