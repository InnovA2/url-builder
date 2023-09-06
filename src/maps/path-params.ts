import { ParamFindPredicate } from '../types';
import { Params } from './params';

export class PathParams extends Params {
    /**
     * Filter params.
     * @param predicate
     * @return new PathParams
     */
    filter(predicate: ParamFindPredicate): PathParams {
        return new PathParams(this.baseUrl, [...this.entries()].filter(predicate));
    }
}