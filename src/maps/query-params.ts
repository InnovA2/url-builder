import { ParamFindPredicate, ParamType } from '../types';
import { UrlBuilder } from '../url-builder';
import { Params } from './params';

export class QueryParams extends Params {
    filter(predicate: ParamFindPredicate): QueryParams {
        return new QueryParams(this.baseUrl, [...this.entries()].filter(predicate));
    }

    /**
     * Convert query params Map to string
     */
    toString() {
        const queryParams: string[] = [...this.entries()]
            .map(([key, value]) => [key, value].join('='));

        return queryParams.length ? ('?' + queryParams.join('&')) : '';
    }
}