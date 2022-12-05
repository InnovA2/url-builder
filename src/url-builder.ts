import * as urlParser from 'url-parse';
import { Scheme } from './enums/scheme.enum';

export class UrlBuilder {
    private scheme = Scheme.HTTPS;
    private host: string;
    private port: number;
    private pathSegments: string[] = [];
    private params = new Map<string, string | number | boolean>();
    private query = new Map<string, string | number | boolean>();
    private fragment: string;

    static createFromUrl(baseUrl: string): UrlBuilder {
        const url = new UrlBuilder();

        const items = urlParser(baseUrl, true);

        if (items.protocol) {
            url.scheme = (items.protocol.slice(0, -1)) as Scheme;
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

    static splitPath(path: string): string[] {
        return path.split('/').filter((p) => p);
    }

    static trimPath(path: string): string {
        return this.splitPath(path).join('/');
    }

    compareTo(url: UrlBuilder, relative = true): boolean {
        return (relative && url.getRelativePath() === this.getRelativePath()) || (!relative && url.toString() === this.toString());
    }

    getScheme(): Scheme {
        return this.scheme;
    }

    setScheme(scheme: Scheme): UrlBuilder {
        this.scheme = scheme;
        return this;
    }

    getHost(): string {
        return this.host;
    }

    setHost(host: string): UrlBuilder {
        this.host = host;
        return this;
    }

    getPort(): number {
        return this.port;
    }

    setPort(port: number): UrlBuilder {
        this.port = port;
        return this;
    }

    getPathSegments(): string[] {
        return this.pathSegments;
    }

    setPathSegments(segments: string[], params?: Record<string, string | number | boolean>): UrlBuilder {
        this.pathSegments = segments;
        return params ? this.addParams(params) : this;
    }

    addPath(path: string, params?: Record<string, string | number | boolean>): UrlBuilder {
        this.pathSegments.push(...UrlBuilder.splitPath(path));
        return params ? this.addParams(params) : this;
    }

    getParams(): Map<string, string | number | boolean> {
        return this.params;
    }

    setParams(params: Map<string, string | number | boolean>): UrlBuilder {
        this.params = params;
        return this;
    }

    addParam(key: string, value: string | number | boolean): UrlBuilder {
        if (!this.params.has(key)) {
            this.params.set(key, value);
        }
        return this;
    }

    addOrReplaceParam(key: string, value: string | number | boolean): UrlBuilder {
        this.params.set(key, value);
        return this;
    }

    addParams(params: Record<string, string | number | boolean>): UrlBuilder {
        for (const [key, value] of Object.entries(params)) {
            this.addParam(key, value);
        }
        return this;
    }

    addOrReplaceParams(params: Record<string, string | number | boolean>): UrlBuilder {
        for (const [key, value] of Object.entries(params)) {
            this.params.set(key, value);
        }
        return this;
    }

    getQueryParams(): Map<string, string | number | boolean> {
        return this.query;
    }

    setQueryParams(query: Map<string, string | number | boolean>): UrlBuilder {
        this.query = query;
        return this;
    }

    addQueryParam(key: string, value: string | number | boolean): UrlBuilder {
        if (!this.query.has(key)) {
            this.query.set(key, value);
        }
        return this;
    }

    addOrReplaceQueryParam(key: string, value: string | number | boolean): UrlBuilder {
        this.query.set(key, value);
        return this;
    }

    addQueryParams(queries: Record<string, string | number | boolean>): UrlBuilder {
        for (const [key, value] of Object.entries(queries)) {
            this.addQueryParam(key, value);
        }
        return this;
    }

    addOrReplaceQueryParams(queries: Record<string, string | number | boolean>): UrlBuilder {
        for (const [key, value] of Object.entries(queries)) {
            this.query.set(key, value);
        }
        return this;
    }

    getFragment(): string {
        return this.fragment;
    }

    setFragment(fragment: string): UrlBuilder {
        this.fragment = fragment;
        return this;
    }

    mergePathWith(url: UrlBuilder): UrlBuilder {
        this.setPathSegments([...this.pathSegments, ...url.pathSegments]);
        this.setParams(new Map([...this.params.entries(), ...url.params.entries()]))
        this.setQueryParams(new Map([...this.query.entries(), ...url.query.entries()]))

        return this;
    }

    getFirstPath(): string {
        return this.pathSegments[0];
    }

    getLastPath(): string {
        return this.pathSegments[this.pathSegments.length - 1];
    }

    getParent(n = 1): UrlBuilder {
        const parent = UrlBuilder.createFromUrl(this.toString());
        const lastPath = parent.pathSegments.pop();

        parent.pathSegments.filter(path => path !== lastPath);
        parent.params.delete(lastPath.replace(':', ''));
        parent.query = new Map<string, string | number>();

        return n > 1 ? parent.getParent(n - 1) : parent;
    }

    getBetween2Words(a: string, b: string): string {
        const indexA = this.pathSegments.findIndex(path => path === a);
        const indexB = this.pathSegments.findIndex(path => path === b);

        if (indexA === -1 || indexB === -1) {
            return null;
        }
        return this.pathSegments.slice(indexA + 1, indexB)[0];
    }

    getRelativePath(withQuery = false, withFragment = false): string {
        const paths: string[] = [];

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

    getQueryString(): string {
        const queryParams: string[] = [];

        this.query.forEach((value, key) => {
            queryParams.push([key, value].join('='));
        });

        return queryParams.length ? ('?' + queryParams.join('&')) : null;
    }

    toString(): string {
        let baseUrl = this.host ? [this.scheme, this.host].join('://') : '';

        if (this.port) {
            baseUrl = [baseUrl, this.port].join(':');
        }

        return [baseUrl, this.getRelativePath(), this.getQueryString()]
            .filter(item => item)
            .join('');
    }
}
