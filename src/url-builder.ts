import * as urlParser from 'url-parse';
import { Scheme } from './enums/scheme.enum';
import { UrlConstants } from './url.constants';
import { ParamType, IFile } from './types';
import { UrlUtils } from './url.utils';
import { QueryParams } from './maps/query-params';
import { PathParams } from './maps/path-params';

export class UrlBuilder {
    private scheme = Scheme.HTTPS;
    private host: string;
    private port: number;
    private pathSegments: string[] = [];
    private pathParams = new PathParams(this);
    private queryParams = new QueryParams(this);
    private fragment: string;
    private file: IFile;

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

        const segments = UrlUtils.splitPath(items.pathname.replace(UrlConstants.REGEX_BRACE_PARAMS, `${UrlConstants.URL_PATH_PREFIX}$2`));
        if (isFile && segments.length > 0 && segments[segments.length - 1]) {
            url.file = UrlUtils.parseFile(segments[segments.length - 1]);
            if (url.file) {
                segments.splice(-1);
            }
        }
        url.pathSegments = segments;

        if (items.query) {
            for (const [key, value] of Object.entries(items.query)) {
                url.queryParams.set(key, String(value));
            }
        }

        url.fragment = items.hash.slice(1);

        return url;
    }

    copy(): UrlBuilder {
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
    compareTo(url: UrlBuilder, relative = true): boolean {
        return (relative && url.getRelativePath() === this.getRelativePath()) || (!relative && url.toString() === this.toString());
    }

    /**
     * Compare the current path to another one, taking into account or not parameters
     * @param path relative path to compare to (e.g. /users/10/groups or /users/:id/groups)
     * @param validateUnfilledParams true to validate pathParams unfilled from currentUrl (e.g. /users/:id/groups)
     */
    compareToPathBySegment(path: string, validateUnfilledParams = false): boolean {
        const pathSegments = UrlUtils.splitPath(path);
        const matches = this.pathSegments.map((segment, i) => {
            if (!pathSegments[i]) {
                return false;
            }
            if (segment.startsWith(UrlConstants.URL_PATH_PREFIX)) {
                const param = this.pathParams.get(segment.replace(UrlConstants.URL_PATH_PREFIX, ''));
                return validateUnfilledParams || (param === pathSegments[i]);
            }
            return pathSegments[i].toLowerCase() === segment.toLowerCase();
        });

        return pathSegments.length === this.pathSegments.length && matches.every((m) => m);
    }

    getScheme(): Scheme {
        return this.scheme;
    }

    setScheme(scheme: Scheme): this {
        this.scheme = scheme;
        return this;
    }

    getHost(): string {
        return this.host;
    }

    setHost(host: string): this {
        this.host = host;
        return this;
    }

    getPort(): number {
        return this.port;
    }

    setPort(port: number): this {
        this.port = port;
        return this;
    }

    getPathSegments(): string[] {
        return this.pathSegments;
    }

    setPathSegments(segments: string[], params?: Record<string, ParamType>): UrlBuilder {
        this.pathSegments = segments;
        return params ? this.pathParams.addAll(params).getBaseUrl() : this;
    }

    addPath(path: string, params?: Record<string, ParamType>): UrlBuilder {
        this.pathSegments.push(...UrlUtils.splitPath(path));
        return params ? this.pathParams.addAll(params).getBaseUrl() : this;
    }

    getPathParams(): PathParams {
        return this.pathParams;
    }

    setPathParams(params: PathParams): this {
        this.pathParams = params;
        return this;
    }

    getQueryParams(): QueryParams {
        return this.queryParams;
    }

    setQueryParams(query: QueryParams): this {
        this.queryParams = query;
        return this;
    }

    addQueryParam(key: string, value: ParamType): this {
        this.getQueryParams().add(key, value)
        return this;
    }

    setFilename(filename: string): this {
        this.file = UrlUtils.parseFile(filename);
        return this;
    }

    setFile(file: IFile): this {
        this.file = file;
        return this;
    }

    getFile(): IFile {
        return this.file;
    }

    getFragment(): string {
        return this.fragment;
    }

    setFragment(fragment: string): this {
        this.fragment = fragment;
        return this;
    }

    /**
     * Merge path segments, pathParams and queryParams with passed UrlBuilder
     * @param url to merge path
     */
    mergePathWith(url: UrlBuilder): this {
        this.setPathSegments([...this.pathSegments, ...url.pathSegments]);
        this.setPathParams(new PathParams(this, [...this.pathParams.entries(), ...url.pathParams.entries()]));
        this.setQueryParams(new QueryParams(this, [...this.queryParams.entries(), ...url.queryParams.entries()]));
        this.setFile(url.getFile());

        return this;
    }

    /**
     * Get first path segment
     */
    getFirstPathSegment(): string {
        return this.pathSegments?.[0];
    }

    /**
     * Get last path segment
     */
    getLastPathSegment(): string {
        return this.pathSegments?.[this.pathSegments.length - 1];
    }

    /**
     * Get parent of the current url (e.g. /users/:id/groups -> /users/:id)
     * @param n offset/level
     */
    getParent(n = 1): UrlBuilder {
        const parent = this.copy();
        const lastPath = parent.pathSegments.pop();

        parent.pathParams.delete(lastPath.replace(UrlConstants.URL_PATH_PREFIX, ''));
        parent.queryParams = new QueryParams(parent);

        return n > 1 ? parent.getParent(n - 1) : parent;
    }

    /**
     * Get path segments between two segments
     * @param a first segment to search
     * @param b last segment to search
     */
    getBetween2Segments(a: string, b: string): string | null {
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
    getRelativePath(withQuery = false, withFragment = false): string {
        const paths: string[] = [];

        for (let path of this.pathSegments) {
            const param = Array.from(this.pathParams.entries())
                .find(([k, v]) => `${UrlConstants.URL_PATH_PREFIX}${k}` === path);

            if (param) {
                path = String(param[1]);
            }

            paths.push(path);
        }

        const relativePath = paths.length ? (UrlConstants.URL_PATH_SEPARATOR + paths.join(UrlConstants.URL_PATH_SEPARATOR)) : '';
        const filename = this.file ? UrlConstants.URL_PATH_SEPARATOR + [this.file.name, this.file.ext].join(UrlConstants.URL_EXT_SEPARATOR) : '';

        const url = relativePath + filename + (withQuery ? this.queryParams.toString() : '');
        return withFragment && this.fragment ? `${url}#${this.fragment}` : url;
    }

    /**
     * Convert full UrlBuilder to string url
     */
    toString(): string {
        let baseUrl = this.host ? [this.scheme, this.host].join('://') : '';

        if (this.port) {
            baseUrl = [baseUrl, this.port].join(':');
        }

        return [baseUrl, this.getRelativePath(true, true)]
            .filter(item => item)
            .join('');
    }

    private propertyMapping(value: any): any {
        switch (true) {
            case Array.isArray(value):
                return [...value];

            case value instanceof PathParams:
                return new PathParams(this, value);

            case value instanceof QueryParams:
                return new QueryParams(this, value);

            case typeof value === 'object':
                return { ...value };

            default:
                return value;
        }
    }
}
