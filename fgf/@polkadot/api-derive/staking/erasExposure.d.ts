import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { DeriveEraExposure } from '../types';
export declare function _eraExposure(instanceId: string, api: ApiInterfaceRx): (era: EraIndex, withActive: boolean) => Observable<DeriveEraExposure>;
export declare function eraExposure(instanceId: string, api: ApiInterfaceRx): (era: EraIndex) => Observable<DeriveEraExposure>;
export declare function _erasExposure(instanceId: string, api: ApiInterfaceRx): (eras: EraIndex[], withActive: boolean) => Observable<DeriveEraExposure[]>;
export declare function erasExposure(instanceId: string, api: ApiInterfaceRx): (withActive?: boolean) => Observable<DeriveEraExposure[]>;
