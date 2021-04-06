import * as urlParser from 'url-parse';
import {Scheme} from './enums/scheme.enum';

export class UrlBuilder {
    private scheme = Scheme.HTTPS;
    private host: string;
    private port: number;
    private paths: string[] = [];
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

        url.paths = this.splitPath(items.pathname);

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

    setPort(port: number): UrlBuilder {
        this.port = port;
        return this;
    }

    addPath(path: string): UrlBuilder {
        this.paths.push(...UrlBuilder.splitPath(path));
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

    getParams(): Map<string, string | number> {
        return this.params;
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

    getQuery(): Map<string, string | number> {
        return this.query;
    }

    getFirstPath(): string {
        return this.paths[0];
    }

    getLastPath(): string {
        return this.paths[this.paths.length - 1];
    }

    getParent(n = 1): UrlBuilder {
        const parent = UrlBuilder.createFromUrl(this.toString());
        const lastPath = parent.paths.pop();

        parent.paths.filter(path => path !== lastPath);
        parent.params.delete(lastPath.replace(':', ''));
        parent.query = new Map<string, string | number>();

        return n > 1 ? parent.getParent(n - 1) : parent;
    }

    getBetween2Words(a: string, b: string): string {
        const indexA = this.paths.findIndex(path => path === a);
        const indexB = this.paths.findIndex(path => path === b);

        if (indexA === -1 || indexB === -1) {
            return null;
        }
        return this.paths.slice(indexA + 1, indexB)[0];
    }

    getRelativePath(query = false): string {
        const paths: string[] = [];

        for (let path of this.paths) {
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
