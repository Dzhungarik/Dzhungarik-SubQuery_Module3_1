import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { DeriveEraSlashes } from '../types';
export declare function _eraSlashes(instanceId: string, api: ApiInterfaceRx): (era: EraIndex, withActive: boolean) => Observable<DeriveEraSlashes>;
export declare function eraSlashes(instanceId: string, api: ApiInterfaceRx): (era: EraIndex) => Observable<DeriveEraSlashes>;
export declare function _erasSlashes(instanceId: string, api: ApiInterfaceRx): (eras: EraIndex[], withActive: boolean) => Observable<DeriveEraSlashes[]>;
export declare function erasSlashes(instanceId: string, api: ApiInterfaceRx): (withActive?: boolean) => Observable<DeriveEraSlashes[]>;
