"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlUtils = void 0;
const url_constants_1 = require("./url.constants");
var UrlUtils;
(function (UrlUtils) {
    /**
     * Split path in segments by slash
     * @param path relative path to split
     */
    UrlUtils.splitPath = (path) => {
        return path.split(url_constants_1.UrlConstants.URL_PATH_SEPARATOR)
            .filter(segment => segment)
            .map(segment => segment.replace(url_constants_1.UrlConstants.REGEX_BRACE_PARAMS, `${url_constants_1.UrlConstants.URL_PATH_PREFIX}$2`));
    };
    /**
     * Trim path (e.g. /users/:id/ -> user/:id)
     * @param path relative path to trim
     */
    UrlUtils.trimPath = (path) => {
        return UrlUtils.splitPath(path).join(url_constants_1.UrlConstants.URL_PATH_SEPARATOR);
    };
    /**
     * Parse filename to create file object containing name and ext (extension)
     * @param filename filename to parse
     */
    UrlUtils.parseFile = (filename) => {
        const matchType = filename.match(url_constants_1.UrlConstants.REGEX_FILENAME);
        if (matchType && matchType.length > 2) {
            return {
                name: matchType[1],
                ext: matchType[2].replace(/\./, '')
            };
        }
        return null;
    };
})(UrlUtils = exports.UrlUtils || (exports.UrlUtils = {}));
