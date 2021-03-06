import type { Memoized } from '@polkadot/util/types';
import { Observable } from 'rxjs';
declare type ObsFn<T> = (...params: any[]) => Observable<T>;
/** @internal */
export declare function memo<T>(instanceId: string, inner: ObsFn<T>): Memoized<ObsFn<T>>;
export {};
