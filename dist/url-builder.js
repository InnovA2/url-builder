"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlBuilder = void 0;
const urlParser = require("url-parse");
const scheme_enum_1 = require("./enums/scheme.enum");
class UrlBuilder {
    constructor() {
        this.scheme = scheme_enum_1.Scheme.HTTPS;
        this.pathSegments = [];
        this.params = new Map();
        this.query = new Map();
    }
    static createFromUrl(baseUrl) {
        const url = new UrlBuilder();
        const items = urlParser(baseUrl, true);
        if (items.protocol) {
            url.scheme = (items.protocol.slice(0, -1));
        }
        url.host = items.hostname;
        if (items.port) {
            url.port = +items.port;
        }
        url.pathSegments = this.splitPath(items.pathname);
        if (items.query) {
            for (const [key, value] of Object.entries(items.query)) {
                url.query.set(key, String(value));
            }
        }
        url.fragment = items.hash.slice(1);
        return url;
    }
    static splitPath(path) {
        return path.split('/').filter((p) => p);
    }
    static trimPath(path) {
        return this.splitPath(path).join('/');
    }
    compareTo(url, relative = true) {
        return (relative && url.getRelativePath() === this.getRelativePath()) || (!relative && url.toString() === this.toString());
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
    getFragment() {
        return this.fragment;
    }
    setFragment(fragment) {
        this.fragment = fragment;
        return this;
    }
    mergePathWith(url) {
        this.setPathSegments([...this.pathSegments, ...url.pathSegments]);
        this.setParams(new Map([...this.params.entries(), ...url.params.entries()]));
        this.setQueryParams(new Map([...this.query.entries(), ...url.query.entries()]));
        return this;
    }
    getFirstPath() {
        return this.pathSegments[0];
    }
    getLastPath() {
        return this.pathSegments[this.pathSegments.length - 1];
    }
    getParent(n = 1) {
        const parent = UrlBuilder.createFromUrl(this.toString());
        const lastPath = parent.pathSegments.pop();
        parent.pathSegments.filter(path => path !== lastPath);
        parent.params.delete(lastPath.replace(':', ''));
        parent.query = new Map();
        return n > 1 ? parent.getParent(n - 1) : parent;
    }
    getBetween2Words(a, b) {
        const indexA = this.pathSegments.findIndex(path => path === a);
        const indexB = this.pathSegments.findIndex(path => path === b);
        if (indexA === -1 || indexB === -1) {
            return null;
        }
        return this.pathSegments.slice(indexA + 1, indexB)[0];
    }
    getRelativePath(withQuery = false, withFragment = false) {
        const paths = [];
        for (let path of this.pathSegments) {
            const param = Array.from(this.params.entries())
                .find(([k, v]) => `:${k}` === path);
            if (param) {
                path = String(param[1]);
            }
            paths.push(path);
        }
        const relativePath = paths.length ? ('/' + paths.join('/')) : '';
        const queryString = this.getQueryString();
        const url = withQuery && queryString ? relativePath + queryString : relativePath;
        return withFragment ? `${url}#${this.fragment}` : url;
    }
    getQueryString() {
        const queryParams = [];
        this.query.forEach((value, key) => {
            queryParams.push([key, value].join('='));
        });
        return queryParams.length ? ('?' + queryParams.join('&')) : null;
    }
    toString() {
        let baseUrl = this.host ? [this.scheme, this.host].join('://') : '';
        if (this.port) {
            baseUrl = [baseUrl, this.port].join(':');
        }
        return [baseUrl, this.getRelativePath(), this.getQueryString()]
            .filter(item => item)
            .join('');
    }
}
exports.UrlBuilder = UrlBuilder;
