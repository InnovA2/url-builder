import { Scheme } from './enums/scheme.enum';
import { FileInterface } from './file.interface';
import { ParamFindPredicate, ParamType } from './types';
export declare class UrlBuilder {
    private scheme;
    private host;
    private port;
    private pathSegments;
    private params;
    private queryParams;
    private fragment;
    private file;
    /**
     * Create UrlBuilder instance from string url
     * @param baseUrl
     * @param isFile true if the URL contains filename (e.g. http://localhost/books/10.html -> 10.html)
     */
    static createFromUrl(baseUrl: string, isFile?: boolean): UrlBuilder;
    /**
     * Split path in segments by slash.
     * @deprecated Deprecated since version 2.3.0 and will be removed on 3.0.0. Use **UrlUtils.splitPath()** instead.
     * @param path relative path to split
     */
    static splitPath(path: string): string[];
    /**
     * Trim path (e.g. /users/:id/ -> user/:id).
     * @deprecated Deprecated since version 2.3.0 and will be removed on 3.0.0. Use **UrlUtils.trimPath()** instead.
     * @param path relative path to trim
     */
    static trimPath(path: string): string;
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
     * @param validateUnfilledParams true to validate params unfilled from currentUrl (e.g. /users/:id/groups)
     */
    compareToPathBySegment(path: string, validateUnfilledParams?: boolean): boolean;
    getScheme(): Scheme;
    setScheme(scheme: Scheme): UrlBuilder;
    getHost(): string;
    setHost(host: string): UrlBuilder;
    getPort(): number;
    setPort(port: number): UrlBuilder;
    getPathSegments(): string[];
    setPathSegments(segments: string[], params?: Record<string, ParamType>): UrlBuilder;
    addPath(path: string, params?: Record<string, ParamType>): UrlBuilder;
    getParams(): Map<string, ParamType>;
    findParams(predicate: ParamFindPredicate): Map<string, ParamType>;
    setParams(params: Map<string, ParamType>): UrlBuilder;
    addParam(key: string, value: ParamType): UrlBuilder;
    addOrReplaceParam(key: string, value: ParamType): UrlBuilder;
    addParams(params: Record<string, ParamType>): UrlBuilder;
    addOrReplaceParams(params: Record<string, ParamType>): UrlBuilder;
    getQueryParams(): Map<string, ParamType>;
    findQueryParams(predicate: ParamFindPredicate): Map<string, ParamType>;
    setQueryParams(query: Map<string, ParamType>): UrlBuilder;
    addQueryParam(key: string, value: ParamType): UrlBuilder;
    addOrReplaceQueryParam(key: string, value: ParamType): UrlBuilder;
    addQueryParams(queries: Record<string, ParamType>): UrlBuilder;
    addOrReplaceQueryParams(queries: Record<string, ParamType>): UrlBuilder;
    setFilename(filename: string): UrlBuilder;
    setFile(file: FileInterface): UrlBuilder;
    getFile(): FileInterface;
    getFragment(): string;
    setFragment(fragment: string): UrlBuilder;
    /**
     * Merge path segments, params and queryParams with passed UrlBuilder
     * @param url to merge path
     */
    mergePathWith(url: UrlBuilder): UrlBuilder;
    /**
     * Get first path segment
     */
    getFirstPathSegment(): string;
    /**
     * Get first path segment.
     * @deprecated Deprecated since version 2.3.0 and will be removed on 3.0.0. Use **getFirstPathSegment()** instead.
     */
    getFirstPath(): string;
    /**
     * Get last path segment
     */
    getLastPathSegment(): string;
    /**
     * Get last path segment
     * @deprecated Deprecated since version 2.3.0 and will be removed on 3.0.0. Use **getLastPathSegment()** instead.
     */
    getLastPath(): string;
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
    getBetween2Segments(a: string, b: string): string;
    /**
     * Get relative path
     * @param withQuery true to get queryParams params
     * @param withFragment true to get fragment
     */
    getRelativePath(withQuery?: boolean, withFragment?: boolean): string;
    /**
     * Get queryParams params as string
     */
    getQueryString(): string;
    /**
     * Convert full UrlBuilder to string url
     */
    toString(): string;
    private propertyMapping;
}
