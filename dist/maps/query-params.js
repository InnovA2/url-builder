"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParams = void 0;
const params_1 = require("./params");
class QueryParams extends params_1.Params {
    /**
     * Filter params.
     * @param predicate
     * @return new QueryParams
     */
    filter(predicate) {
        return new QueryParams(this.baseUrl, [...this.entries()].filter(predicate));
    }
    /**
     * Convert query params Map to string
     */
    toString() {
        const queryParams = [...this.entries()]
            .map(([key, value]) => [key, value].join('='));
        return queryParams.length ? ('?' + queryParams.join('&')) : '';
    }
}
exports.QueryParams = QueryParams;
