"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathParams = void 0;
const params_1 = require("./params");
class PathParams extends params_1.Params {
    /**
     * Filter params.
     * @param predicate
     * @return new PathParams
     */
    filter(predicate) {
        return new PathParams(this.baseUrl, [...this.entries()].filter(predicate));
    }
}
exports.PathParams = PathParams;
