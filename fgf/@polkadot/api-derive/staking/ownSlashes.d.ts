import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { DeriveStakerSlashes } from '../types';
export declare function _ownSlashes(instanceId: string, api: ApiInterfaceRx): (accountId: Uint8Array | string, eras: EraIndex[], withActive: boolean) => Observable<DeriveStakerSlashes[]>;
export declare function ownSlash(instanceId: string, api: ApiInterfaceRx): (accountId: Uint8Array | string, era: EraIndex) => Observable<DeriveStakerSlashes>;
export declare function ownSlashes(instanceId: string, api: ApiInterfaceRx): (accountId: Uint8Array | string, withActive?: boolean) => Observable<DeriveStakerSlashes[]>;
