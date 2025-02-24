"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlBuilder = void 0;
const scheme_enum_1 = require("./enums/scheme.enum");
const url_constants_1 = require("./url.constants");
const url_utils_1 = require("./url.utils");
const query_params_1 = require("./maps/query-params");
const path_params_1 = require("./maps/path-params");
class UrlBuilder {
    constructor() {
        this.scheme = scheme_enum_1.Scheme.HTTPS;
        this.pathSegments = [];
        this.pathParams = new path_params_1.PathParams(this);
        this.queryParams = new query_params_1.QueryParams(this);
    }
    /**
     * Create UrlBuilder instance from string url
     * @param url the url (if it does not contain the domain, please fill in the "base" parameter)
     * @param base the default base url, required only if the "url" param does not contain the domain
     * @param isFile true if the URL contains filename (e.g. http://localhost/books/10.html -> 10.html)
     */
    static createFromUrl(url, defaultBase, isFile = false) {
        const builder = new UrlBuilder();
        const items = new URL(url, defaultBase);
        if (items.protocol) {
            builder.scheme = (items.protocol.slice(0, -1));
        }
        builder.host = items.hostname;
        if (items.port) {
            builder.port = +items.port;
        }
        const segments = url_utils_1.UrlUtils.splitPath(items.pathname.replace(url_constants_1.UrlConstants.REGEX_BRACE_PARAMS, `${url_constants_1.UrlConstants.URL_PATH_PREFIX}$2`));
        if (isFile && segments.length > 0 && segments[segments.length - 1]) {
            builder.file = url_utils_1.UrlUtils.parseFile(segments[segments.length - 1]);
            if (builder.file) {
                segments.splice(-1);
            }
        }
        builder.pathSegments = segments;
        if (items.searchParams) {
            for (const [key, value] of items.searchParams.entries()) {
                builder.queryParams.set(key, String(value));
            }
        }
        builder.fragment = items.hash.slice(1);
        return builder;
    }
    copy() {
        const url = new UrlBuilder();
        for (const [key, value] of Object.entries(this)) {
            url[key] = url.propertyMapping(value);
        }
        return url;
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
     * Compare the current path to another one, taking into account or not parameters
     * @param path relative path to compare to (e.g. /users/10/groups or /users/:id/groups)
     * @param validateUnfilledParams true to validate pathParams unfilled from currentUrl (e.g. /users/:id/groups)
     */
    compareToPathBySegment(path, validateUnfilledParams = false) {
        const pathSegments = url_utils_1.UrlUtils.splitPath(path);
        const matches = this.pathSegments.map((segment, i) => {
            if (!pathSegments[i]) {
                return false;
            }
            if (segment.startsWith(url_constants_1.UrlConstants.URL_PATH_PREFIX)) {
                const param = this.pathParams.get(segment.replace(url_constants_1.UrlConstants.URL_PATH_PREFIX, ''));
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
        return params ? this.pathParams.addAll(params).getBaseUrl() : this;
    }
    addPath(path, params) {
        this.pathSegments.push(...url_utils_1.UrlUtils.splitPath(path));
        return params ? this.pathParams.addAll(params).getBaseUrl() : this;
    }
    getPathParams() {
        return this.pathParams;
    }
    setPathParams(params) {
        this.pathParams = params;
        return this;
    }
    getQueryParams() {
        return this.queryParams;
    }
    setQueryParams(query) {
        this.queryParams = query;
        return this;
    }
    addQueryParam(key, value) {
        this.getQueryParams().add(key, value);
        return this;
    }
    setFilename(filename) {
        this.file = url_utils_1.UrlUtils.parseFile(filename);
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
     * Merge path segments, pathParams and queryParams with passed UrlBuilder
     * @param url to merge path
     */
    mergePathWith(url) {
        this.setPathSegments([...this.pathSegments, ...url.pathSegments]);
        this.setPathParams(new path_params_1.PathParams(this, [...this.pathParams.entries(), ...url.pathParams.entries()]));
        this.setQueryParams(new query_params_1.QueryParams(this, [...this.queryParams.entries(), ...url.queryParams.entries()]));
        this.setFile(url.getFile());
        return this;
    }
    /**
     * Get first path segment
     */
    getFirstPathSegment() {
        var _a;
        return (_a = this.pathSegments) === null || _a === void 0 ? void 0 : _a[0];
    }
    /**
     * Get last path segment
     */
    getLastPathSegment() {
        var _a;
        return (_a = this.pathSegments) === null || _a === void 0 ? void 0 : _a[this.pathSegments.length - 1];
    }
    /**
     * Get parent of the current url (e.g. /users/:id/groups -> /users/:id)
     * @param n offset/level
     */
    getParent(n = 1) {
        const parent = this.copy();
        const lastPath = parent.pathSegments.pop();
        parent.pathParams.delete(lastPath.replace(url_constants_1.UrlConstants.URL_PATH_PREFIX, ''));
        parent.queryParams = new query_params_1.QueryParams(parent);
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
     * @param withQuery true to get queryParams pathParams
     * @param withFragment true to get fragment
     */
    getRelativePath(withQuery = false, withFragment = false) {
        const paths = [];
        for (let path of this.pathSegments) {
            const param = Array.from(this.pathParams.entries())
                .find(([k, v]) => `${url_constants_1.UrlConstants.URL_PATH_PREFIX}${k}` === path);
            if (param) {
                path = String(param[1]);
            }
            paths.push(path);
        }
        const relativePath = paths.length ? (url_constants_1.UrlConstants.URL_PATH_SEPARATOR + paths.join(url_constants_1.UrlConstants.URL_PATH_SEPARATOR)) : '';
        const filename = this.file ? url_constants_1.UrlConstants.URL_PATH_SEPARATOR + [this.file.name, this.file.ext].join(url_constants_1.UrlConstants.URL_EXT_SEPARATOR) : '';
        const url = relativePath + filename + (withQuery ? this.queryParams.toString() : '');
        return withFragment && this.fragment ? `${url}#${this.fragment}` : url;
    }
    /**
     * Convert full UrlBuilder to string url
     */
    toString() {
        let baseUrl = this.host ? [this.scheme, this.host].join('://') : '';
        if (this.port) {
            baseUrl = [baseUrl, this.port].join(':');
        }
        return [baseUrl, this.getRelativePath(true, true)]
            .filter(item => item)
            .join('');
    }
    propertyMapping(value) {
        switch (true) {
            case Array.isArray(value):
                return [...value];
            case value instanceof path_params_1.PathParams:
                return new path_params_1.PathParams(this, value);
            case value instanceof query_params_1.QueryParams:
                return new query_params_1.QueryParams(this, value);
            case typeof value === 'object':
                return Object.assign({}, value);
            default:
                return value;
        }
    }
}
exports.UrlBuilder = UrlBuilder;
