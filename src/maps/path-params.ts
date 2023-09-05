import { ParamFindPredicate } from '../types';
import { Params } from './params';

export class PathParams extends Params {
    filter(predicate: ParamFindPredicate): PathParams {
        return new PathParams(this.baseUrl, [...this.entries()].filter(predicate));
    }
}