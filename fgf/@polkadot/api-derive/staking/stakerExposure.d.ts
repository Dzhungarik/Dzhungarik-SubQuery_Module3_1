import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { DeriveStakerExposure } from '../types';
export declare function _stakerExposures(instanceId: string, api: ApiInterfaceRx): (accountIds: (Uint8Array | string)[], eras: EraIndex[], withActive: boolean) => Observable<DeriveStakerExposure[][]>;
export declare function stakerExposures(instanceId: string, api: ApiInterfaceRx): (accountIds: (Uint8Array | string)[], withActive?: boolean) => Observable<DeriveStakerExposure[][]>;
export declare function stakerExposure(instanceId: string, api: ApiInterfaceRx): (accountId: Uint8Array | string, withActive?: boolean) => Observable<DeriveStakerExposure[]>;
