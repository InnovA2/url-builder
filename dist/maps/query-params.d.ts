import { ParamFindPredicate } from '../types';
import { Params } from './params';
export declare class QueryParams extends Params {
    /**
     * Filter params.
     * @param predicate
     * @return new QueryParams
     */
    filter(predicate: ParamFindPredicate): QueryParams;
    /**
     * Convert query params Map to string
     */
    toString(): string;
}
