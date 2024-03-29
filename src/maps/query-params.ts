import { ParamFindPredicate } from '../types';
import { Params } from './params';

export class QueryParams extends Params {
    /**
     * Filter params.
     * @param predicate
     * @return new QueryParams
     */
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