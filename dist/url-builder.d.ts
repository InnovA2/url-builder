import { Scheme } from './enums/scheme.enum';
import { ParamType, IFile } from './types';
import { QueryParams } from './maps/query-params';
import { PathParams } from './maps/path-params';
export declare class UrlBuilder {
    private scheme;
    private host;
    private port;
    private pathSegments;
    private pathParams;
    private queryParams;
    private fragment;
    private file;
    /**
     * Create UrlBuilder instance from string url
     * @param url the url (if it does not contain the domain, please fill in the "base" parameter)
     * @param base the default base url, required only if the "url" param does not contain the domain
     * @param isFile true if the URL contains filename (e.g. http://localhost/books/10.html -> 10.html)
     */
    static createFromUrl(url: string, defaultBase?: string, isFile?: boolean): UrlBuilder;
    copy(): UrlBuilder;
    /**
     * Compare the current UrlBuilder to another
     * @param url UrlBuilder to compare
     * @param relative true to compare only relative path
     */
    compareTo(url: UrlBuilder, relative?: boolean): boolean;
    /**
     * Compare the current path to another one, taking into account or not parameters
     * @param path relative path to compare to (e.g. /users/10/groups or /users/:id/groups)
     * @param validateUnfilledParams true to validate pathParams unfilled from currentUrl (e.g. /users/:id/groups)
     */
    compareToPathBySegment(path: string, validateUnfilledParams?: boolean): boolean;
    getScheme(): Scheme;
    setScheme(scheme: Scheme): this;
    getHost(): string;
    setHost(host: string): this;
    getPort(): number;
    setPort(port: number): this;
    getPathSegments(): string[];
    setPathSegments(segments: string[], params?: Record<string, ParamType>): UrlBuilder;
    addPath(path: string, params?: Record<string, ParamType>): UrlBuilder;
    getPathParams(): PathParams;
    setPathParams(params: PathParams): this;
    getQueryParams(): QueryParams;
    setQueryParams(query: QueryParams): this;
    addQueryParam(key: string, value: ParamType): this;
    setFilename(filename: string): this;
    setFile(file: IFile): this;
    getFile(): IFile;
    getFragment(): string;
    setFragment(fragment: string): this;
    /**
     * Merge path segments, pathParams and queryParams with passed UrlBuilder
     * @param url to merge path
     */
    mergePathWith(url: UrlBuilder): this;
    /**
     * Get first path segment
     */
    getFirstPathSegment(): string;
    /**
     * Get last path segment
     */
    getLastPathSegment(): string;
    /**
     * Get parent of the current url (e.g. /users/:id/groups -> /users/:id)
     * @param n offset/level
     */
    getParent(n?: number): UrlBuilder;
    /**
     * Get path segments between two segments
     * @param a first segment to search
     * @param b last segment to search
     */
    getBetween2Segments(a: string, b: string): string | null;
    /**
     * Get relative path
     * @param withQuery true to get queryParams pathParams
     * @param withFragment true to get fragment
     */
    getRelativePath(withQuery?: boolean, withFragment?: boolean): string;
    /**
     * Convert full UrlBuilder to string url
     */
    toString(): string;
    private propertyMapping;
}
