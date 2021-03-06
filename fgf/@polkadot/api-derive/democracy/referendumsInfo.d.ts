/// <reference types="bn.js" />
import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { Option } from '@polkadot/types';
import type { ReferendumInfo, ReferendumInfoTo239 } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { DeriveReferendum, DeriveReferendumVotes } from '../types';
export declare function _referendumVotes(instanceId: string, api: ApiInterfaceRx): (referendum: DeriveReferendum) => Observable<DeriveReferendumVotes>;
export declare function _referendumsVotes(instanceId: string, api: ApiInterfaceRx): (referendums: DeriveReferendum[]) => Observable<DeriveReferendumVotes[]>;
export declare function _referendumInfo(instanceId: string, api: ApiInterfaceRx): (index: BN, info: Option<ReferendumInfo | ReferendumInfoTo239>) => Observable<DeriveReferendum | null>;
export declare function referendumsInfo(instanceId: string, api: ApiInterfaceRx): (ids: BN[]) => Observable<DeriveReferendum[]>;
