import * as urlParser from 'url-parse';
import { Scheme } from './enums/scheme.enum';
import { UrlConstants } from './url.constants';
import { FileInterface } from './file.interface';

export class UrlBuilder {
    private scheme = Scheme.HTTPS;
    private host: string;
    private port: number;
    private pathSegments: string[] = [];
    private params = new Map<string, string | number | boolean>();
    private query = new Map<string, string | number | boolean>();
    private fragment: string;
    private file: FileInterface;

    /**
     * Create UrlBuilder instance from string url
     * @param baseUrl
     * @param isFile true if the URL contains filename (e.g. http://localhost/books/10.html -> 10.html)
     */
    static createFromUrl(baseUrl: string, isFile = false): UrlBuilder {
        const url = new UrlBuilder();

        const items = urlParser(baseUrl, true);

        if (items.protocol) {
            url.scheme = (items.protocol.slice(0, -1)) as Scheme;
        }

        url.host = items.hostname;

        if (items.port) {
            url.port = +items.port;
        }

        const segments = this.splitPath(items.pathname.replace(UrlConstants.REGEX_BRACE_PARAMS, `${UrlConstants.URL_PATH_PREFIX}$2`));
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
    static splitPath(path: string): string[] {
        return path.split(UrlConstants.URL_PATH_SEPARATOR)
            .filter(segment => segment)
            .map(segment => segment.replace(UrlConstants.REGEX_BRACE_PARAMS, `${UrlConstants.URL_PATH_PREFIX}$2`));
    }

    /**
     * Trim path (e.g. /users/:id/ -> user/:id)
     * @param path relative path to trim
     */
    static trimPath(path: string): string {
        return this.splitPath(path).join(UrlConstants.URL_PATH_SEPARATOR);
    }

    /**
     * Compare the current UrlBuilder to another
     * @param url UrlBuilder to compare
     * @param relative true to compare only relative path
     */
    compareTo(url: UrlBuilder, relative = true): boolean {
        return (relative && url.getRelativePath() === this.getRelativePath()) || (!relative && url.toString() === this.toString());
    }

    /**
     * Compare the current path to another one, taking into account or not parameters
     * @param path relative path to compare to (e.g. /users/10/groups or /users/:id/groups)
     * @param validateUnfilledParams true to validate params unfilled from currentUrl (e.g. /users/:id/groups)
     */
    compareToPathBySegment(path: string, validateUnfilledParams = false): boolean {
        const pathSegments = UrlBuilder.splitPath(path);
        const matches = this.pathSegments.map((segment, i) => {
            if (!pathSegments[i]) {
                return false;
            }
            if (segment.startsWith(UrlConstants.URL_PATH_PREFIX)) {
                const param = this.params.get(segment.replace(UrlConstants.URL_PATH_PREFIX, ''));
                return validateUnfilledParams || (param === pathSegments[i]);
            }
            return pathSegments[i].toLowerCase() === segment.toLowerCase();
        });

        return pathSegments.length === this.pathSegments.length && matches.every((m) => m);
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

    setFilename(filename: string): UrlBuilder {
        this.file = UrlBuilder.parseFile(filename);
        return this;
    }

    setFile(file: FileInterface): UrlBuilder {
        this.file = file;
        return this;
    }

    getFile(): FileInterface {
        return this.file;
    }

    getFragment(): string {
        return this.fragment;
    }

    setFragment(fragment: string): UrlBuilder {
        this.fragment = fragment;
        return this;
    }

    /**
     * Merge path segments, params and queryParams with passed UrlBuilder
     * @param url to merge path
     */
    mergePathWith(url: UrlBuilder): UrlBuilder {
        this.setPathSegments([...this.pathSegments, ...url.pathSegments]);
        this.setParams(new Map([...this.params.entries(), ...url.params.entries()]));
        this.setQueryParams(new Map([...this.query.entries(), ...url.query.entries()]));
        this.setFile(url.getFile());

        return this;
    }

    /**
     * Get first path segment
     */
    getFirstPath(): string {
        return this.pathSegments[0];
    }

    /**
     * Get last path segment
     */
    getLastPath(): string {
        return this.pathSegments[this.pathSegments.length - 1];
    }

    /**
     * Get parent of the current url (e.g. /users/:id/groups -> /users/:id)
     * @param n offset/level
     */
    getParent(n = 1): UrlBuilder {
        const parent = UrlBuilder.createFromUrl(this.toString());
        const lastPath = parent.pathSegments.pop();

        parent.pathSegments.filter(path => path !== lastPath);
        parent.params.delete(lastPath.replace(UrlConstants.URL_PATH_PREFIX, ''));
        parent.query = new Map<string, string | number>();

        return n > 1 ? parent.getParent(n - 1) : parent;
    }

    /**
     * Get path segments between two segments
     * @param a first segment to search
     * @param b last segment to search
     */
    getBetween2Segments(a: string, b: string): string {
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
    getRelativePath(withQuery = false, withFragment = false): string {
        const paths: string[] = [];

        for (let path of this.pathSegments) {
            const param = Array.from(this.params.entries())
                .find(([k, v]) => `${UrlConstants.URL_PATH_PREFIX}${k}` === path);

            if (param) {
                path = String(param[1]);
            }

            paths.push(path);
        }

        const relativePath = paths.length ? (UrlConstants.URL_PATH_SEPARATOR + paths.join(UrlConstants.URL_PATH_SEPARATOR)) : '';
        const queryString = this.getQueryString();
        const filename = this.file ? [this.file.name, this.file.ext].join(UrlConstants.URL_EXT_SEPARATOR) : '';

        const url = withQuery && queryString ? (relativePath + filename + queryString) : (relativePath + filename);
        return withFragment ? `${url}#${this.fragment}` : url;
    }

    /**
     * Get query params as string
     */
    getQueryString(): string {
        const queryParams: string[] = [];

        this.query.forEach((value, key) => {
            queryParams.push([key, value].join('='));
        });

        return queryParams.length ? ('?' + queryParams.join('&')) : null;
    }

    /**
     * Convert full UrlBuilder to string url
     */
    toString(): string {
        let baseUrl = this.host ? [this.scheme, this.host].join('://') : '';

        if (this.port) {
            baseUrl = [baseUrl, this.port].join(':');
        }

        return [baseUrl, this.getRelativePath(), this.getQueryString()]
            .filter(item => item)
            .join('');
    }

    private static parseFile(filename: string): FileInterface {
        const matchType = filename.match(UrlConstants.REGEX_FILENAME);
        if (matchType && matchType.length > 2) {
            return {
                name: matchType[1],
                ext: matchType[2].replace(/\./, '')
            };
        }
        return null;
    }
}
