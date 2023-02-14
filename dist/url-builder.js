"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlBuilder = void 0;
const urlParser = require("url-parse");
const scheme_enum_1 = require("./enums/scheme.enum");
const url_constants_1 = require("./url.constants");
class UrlBuilder {
    constructor() {
        this.scheme = scheme_enum_1.Scheme.HTTPS;
        this.pathSegments = [];
        this.params = new Map();
        this.query = new Map();
    }
    /**
     * Create UrlBuilder instance from string url
     * @param baseUrl
     * @param isFile true if the URL contains filename (e.g. http://localhost/books/10.html -> 10.html)
     */
    static createFromUrl(baseUrl, isFile = false) {
        const url = new UrlBuilder();
        const items = urlParser(baseUrl, true);
        if (items.protocol) {
            url.scheme = (items.protocol.slice(0, -1));
        }
        url.host = items.hostname;
        if (items.port) {
            url.port = +items.port;
        }
        const segments = this.splitPath(items.pathname.replace(url_constants_1.UrlConstants.REGEX_BRACE_PARAMS, `${url_constants_1.UrlConstants.URL_PATH_PREFIX}$2`));
        if (isFile && segments.length > 0 && segments[segments.length - 1]) {
            url.file = this.parseFile(segments[segments.length - 1]);
            if (url.file) {
                segments.splice(-1);
            }
        }
        url.pathSegments = segments;
        if (items.query) {
            for (const [key, value] of Object.entries(items.query)) {
                url.query.set(key, String(value));
            }
        }
        url.fragment = items.hash.slice(1);
        return url;
    }
    /**
     * Split path in segments by slash
     * @param path relative path to split
     */
    static splitPath(path) {
        return path.split(url_constants_1.UrlConstants.URL_PATH_SEPARATOR)
            .filter(segment => segment)
            .map(segment => segment.replace(url_constants_1.UrlConstants.REGEX_BRACE_PARAMS, `${url_constants_1.UrlConstants.URL_PATH_PREFIX}$2`));
    }
    /**
     * Trim path (e.g. /users/:id/ -> user/:id)
     * @param path relative path to trim
     */
    static trimPath(path) {
        return this.splitPath(path).join(url_constants_1.UrlConstants.URL_PATH_SEPARATOR);
    }
    /**
     * Compare the current UrlBuilder to another
     * @param url UrlBuilder to compare
     * @param relative true to compare only relative path
     */
    compareTo(url, relative = true) {
        return (relative && url.getRelativePath() === this.getRelativePath()) || (!relative && url.toString() === this.toString());
    }
    /**
     * Compare current path to unfilled path parameters
     * @param path final relative path (e.g. /users/:id/groups)
     * @param validateUnfilledParams true to validate params unfilled from currentUrl (e.g. /users/:id/groups)
     */
    compareToPathBySegment(path, validateUnfilledParams = false) {
        const pathSegments = UrlBuilder.splitPath(path);
        const matches = this.pathSegments.map((segment, i) => {
            if (!pathSegments[i]) {
                return false;
            }
            if (segment.startsWith(url_constants_1.UrlConstants.URL_PATH_PREFIX)) {
                const param = this.params.get(segment.replace(url_constants_1.UrlConstants.URL_PATH_PREFIX, ''));
                return validateUnfilledParams || (param === pathSegments[i]);
            }
            return pathSegments[i].toLowerCase() === segment.toLowerCase();
        });
        return pathSegments.length === this.pathSegments.length && matches.every((m) => m);
    }
    getScheme() {
        return this.scheme;
    }
    setScheme(scheme) {
        this.scheme = scheme;
        return this;
    }
    getHost() {
        return this.host;
    }
    setHost(host) {
        this.host = host;
        return this;
    }
    getPort() {
        return this.port;
    }
    setPort(port) {
        this.port = port;
        return this;
    }
    getPathSegments() {
        return this.pathSegments;
    }
    setPathSegments(segments, params) {
        this.pathSegments = segments;
        return params ? this.addParams(params) : this;
    }
    addPath(path, params) {
        this.pathSegments.push(...UrlBuilder.splitPath(path));
        return params ? this.addParams(params) : this;
    }
    getParams() {
        return this.params;
    }
    setParams(params) {
        this.params = params;
        return this;
    }
    addParam(key, value) {
        if (!this.params.has(key)) {
            this.params.set(key, value);
        }
        return this;
    }
    addOrReplaceParam(key, value) {
        this.params.set(key, value);
        return this;
    }
    addParams(params) {
        for (const [key, value] of Object.entries(params)) {
            this.addParam(key, value);
        }
        return this;
    }
    addOrReplaceParams(params) {
        for (const [key, value] of Object.entries(params)) {
            this.params.set(key, value);
        }
        return this;
    }
    getQueryParams() {
        return this.query;
    }
    setQueryParams(query) {
        this.query = query;
        return this;
    }
    addQueryParam(key, value) {
        if (!this.query.has(key)) {
            this.query.set(key, value);
        }
        return this;
    }
    addOrReplaceQueryParam(key, value) {
        this.query.set(key, value);
        return this;
    }
    addQueryParams(queries) {
        for (const [key, value] of Object.entries(queries)) {
            this.addQueryParam(key, value);
        }
        return this;
    }
    addOrReplaceQueryParams(queries) {
        for (const [key, value] of Object.entries(queries)) {
            this.query.set(key, value);
        }
        return this;
    }
    setFilename(filename) {
        this.file = UrlBuilder.parseFile(filename);
        return this;
    }
    setFile(file) {
        this.file = file;
        return this;
    }
    getFile() {
        return this.file;
    }
    getFragment() {
        return this.fragment;
    }
    setFragment(fragment) {
        this.fragment = fragment;
        return this;
    }
    /**
     * Merge path segments, params and queryParams with passed UrlBuilder
     * @param url to merge path
     */
    mergePathWith(url) {
        this.setPathSegments([...this.pathSegments, ...url.pathSegments]);
        this.setParams(new Map([...this.params.entries(), ...url.params.entries()]));
        this.setQueryParams(new Map([...this.query.entries(), ...url.query.entries()]));
        this.setFile(url.getFile());
        return this;
    }
    /**
     * Get first path segment
     */
    getFirstPath() {
        return this.pathSegments[0];
    }
    /**
     * Get last path segment
     */
    getLastPath() {
        return this.pathSegments[this.pathSegments.length - 1];
    }
    /**
     * Get parent of the current url (e.g. /users/:id/groups -> /users/:id)
     * @param n offset/level
     */
    getParent(n = 1) {
        const parent = UrlBuilder.createFromUrl(this.toString());
        const lastPath = parent.pathSegments.pop();
        parent.pathSegments.filter(path => path !== lastPath);
        parent.params.delete(lastPath.replace(url_constants_1.UrlConstants.URL_PATH_PREFIX, ''));
        parent.query = new Map();
        return n > 1 ? parent.getParent(n - 1) : parent;
    }
    /**
     * Get path segments between two segments
     * @param a first segment to search
     * @param b last segment to search
     */
    getBetween2Segments(a, b) {
        const indexA = this.pathSegments.findIndex(path => path === a);
        const indexB = this.pathSegments.findIndex(path => path === b);
        if (indexA === -1 || indexB === -1) {
            return null;
        }
        return this.pathSegments.slice(indexA + 1, indexB)[0];
    }
    /**
     * Get relative path
     * @param withQuery true to get query params
     * @param withFragment true to get fragment
     */
    getRelativePath(withQuery = false, withFragment = false) {
        const paths = [];
        for (let path of this.pathSegments) {
            const param = Array.from(this.params.entries())
                .find(([k, v]) => `${url_constants_1.UrlConstants.URL_PATH_PREFIX}${k}` === path);
            if (param) {
                path = String(param[1]);
            }
            paths.push(path);
        }
        const relativePath = paths.length ? (url_constants_1.UrlConstants.URL_PATH_SEPARATOR + paths.join(url_constants_1.UrlConstants.URL_PATH_SEPARATOR)) : '';
        const queryString = this.getQueryString();
        const filename = this.file ? [this.file.name, this.file.ext].join(url_constants_1.UrlConstants.URL_EXT_SEPARATOR) : '';
        const url = withQuery && queryString ? (relativePath + filename + queryString) : (relativePath + filename);
        return withFragment ? `${url}#${this.fragment}` : url;
    }
    /**
     * Get query params as string
     */
    getQueryString() {
        const queryParams = [];
        this.query.forEach((value, key) => {
            queryParams.push([key, value].join('='));
        });
        return queryParams.length ? ('?' + queryParams.join('&')) : null;
    }
    /**
     * Convert full UrlBuilder to string url
     */
    toString() {
        let baseUrl = this.host ? [this.scheme, this.host].join('://') : '';
        if (this.port) {
            baseUrl = [baseUrl, this.port].join(':');
        }
        return [baseUrl, this.getRelativePath(), this.getQueryString()]
            .filter(item => item)
            .join('');
    }
    static parseFile(filename) {
        const matchType = filename.match(url_constants_1.UrlConstants.REGEX_FILENAME);
        if (matchType && matchType.length > 2) {
            return {
                name: matchType[1],
                ext: matchType[2].replace(/\./, '')
            };
        }
        return null;
    }
}
exports.UrlBuilder = UrlBuilder;
