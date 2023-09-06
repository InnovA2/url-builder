import { ParamFindPredicate } from '../types';
import { Params } from './params';
export declare class PathParams extends Params {
    /**
     * Filter params.
     * @param predicate
     * @return new PathParams
     */
    filter(predicate: ParamFindPredicate): PathParams;
}
