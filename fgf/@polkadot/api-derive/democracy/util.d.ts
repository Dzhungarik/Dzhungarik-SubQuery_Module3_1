/// <reference types="bn.js" />
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { Bytes, Option } from '@polkadot/types';
import type { AccountId, Balance, BlockNumber, PreimageStatus, ReferendumInfo, ReferendumInfoTo239, ReferendumStatus, VoteThreshold } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { DeriveProposalImage, DeriveReferendum, DeriveReferendumVote, DeriveReferendumVotes } from '../types';
import { BN } from '@polkadot/util';
declare type PreimageInfo = [Bytes, AccountId, Balance, BlockNumber];
declare type OldPreimage = ITuple<PreimageInfo>;
interface ApproxState {
    votedAye: BN;
    votedNay: BN;
    votedTotal: BN;
}
export declare function compareRationals(n1: BN, d1: BN, n2: BN, d2: BN): boolean;
export declare function calcPassing(threshold: VoteThreshold, sqrtElectorate: BN, state: ApproxState): boolean;
export declare function calcVotes(sqrtElectorate: BN, referendum: DeriveReferendum, votes: DeriveReferendumVote[]): DeriveReferendumVotes;
export declare function getStatus(info: Option<ReferendumInfo | ReferendumInfoTo239>): ReferendumStatus | ReferendumInfoTo239 | null;
export declare function parseImage(api: ApiInterfaceRx, imageOpt: Option<OldPreimage> | Option<PreimageStatus>): DeriveProposalImage | undefined;
export {};
