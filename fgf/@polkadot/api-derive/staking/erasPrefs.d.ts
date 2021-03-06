import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { DeriveEraPrefs } from '../types';
export declare function _eraPrefs(instanceId: string, api: ApiInterfaceRx): (era: EraIndex, withActive: boolean) => Observable<DeriveEraPrefs>;
export declare function eraPrefs(instanceId: string, api: ApiInterfaceRx): (era: EraIndex) => Observable<DeriveEraPrefs>;
export declare function _erasPrefs(instanceId: string, api: ApiInterfaceRx): (eras: EraIndex[], withActive: boolean) => Observable<DeriveEraPrefs[]>;
export declare function erasPrefs(instanceId: string, api: ApiInterfaceRx): (withActive?: boolean) => Observable<DeriveEraPrefs[]>;
