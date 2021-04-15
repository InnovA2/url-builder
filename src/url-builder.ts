import * as urlParser from 'url-parse';
import {Scheme} from './enums/scheme.enum';

export class UrlBuilder {
    private scheme = Scheme.HTTPS;
    private host: string;
    private port: number;
    private pathSegments: string[] = [];
    private params = new Map<string, string | number>();
    private query = new Map<string, string | number>();

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

    setPathSegments(segments: string[]): UrlBuilder {
        this.pathSegments = segments;
        return this;
    }

    addPath(path: string): UrlBuilder {
        this.pathSegments.push(...UrlBuilder.splitPath(path));
        return this;
    }

    getParams(): Map<string, string | number> {
        return this.params;
    }

    setParams(params: Map<string, string | number>): UrlBuilder {
        this.params = params;
        return this;
    }

    addParam(key: string, value: string | number): UrlBuilder {
        this.params.set(key, value);
        return this;
    }

    addParams(params: Record<string, string | number>): UrlBuilder {
        for (const [key, value] of Object.entries(params)) {
            this.params.set(key, value);
        }
        return this;
    }

    getQuery(): Map<string, string | number> {
        return this.query;
    }

    setQuery(query: Map<string, string | number>): UrlBuilder {
        this.query = query;
        return this;
    }

    addQuery(key: string, value: string | number): UrlBuilder {
        this.query.set(key, value);
        return this;
    }

    addQueries(queries: Record<string, string | number>): UrlBuilder {
        for (const [key, value] of Object.entries(queries)) {
            this.query.set(key, value);
        }
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

    getRelativePath(query = false): string {
        const paths: string[] = [];

        for (let path of this.pathSegments) {
            const param = this.params.get(path.replace(':', ''));

            if (param) {
                path = String(param);
            }

            paths.push(path);
        }

        const relativePath = paths.length ? ('/' + paths.join('/')) : '';
        const queryString = this.getQueryString();
        return query && queryString ? relativePath + queryString : relativePath;
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
