import { Scheme } from './enums/scheme.enum';
import { FileInterface } from './file.interface';
export declare class UrlBuilder {
    private scheme;
    private host;
    private port;
    private pathSegments;
    private params;
    private query;
    private fragment;
    private file;
    /**
     * Create UrlBuilder instance from string url
     * @param baseUrl
     * @param isFile true if the URL contains filename (e.g. http://localhost/books/10.html -> 10.html)
     */
    static createFromUrl(baseUrl: string, isFile?: boolean): UrlBuilder;
    /**
     * Split path in segments by slash
     * @param path relative path to split
     */
    static splitPath(path: string): string[];
    /**
     * Trim path (e.g. /users/:id/ -> user/:id)
     * @param path relative path to trim
     */
    static trimPath(path: string): string;
    /**
     * Compare the current UrlBuilder to another
     * @param url UrlBuilder to compare
     * @param relative true to compare only relative path
     */
    compareTo(url: UrlBuilder, relative?: boolean): boolean;
    /**
     * Compare current path to unfilled path parameters
     * @param path final relative path (e.g. /users/:id/groups)
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
    setPathSegments(segments: string[], params?: Record<string, string | number | boolean>): UrlBuilder;
    addPath(path: string, params?: Record<string, string | number | boolean>): UrlBuilder;
    getParams(): Map<string, string | number | boolean>;
    setParams(params: Map<string, string | number | boolean>): UrlBuilder;
    addParam(key: string, value: string | number | boolean): UrlBuilder;
    addOrReplaceParam(key: string, value: string | number | boolean): UrlBuilder;
    addParams(params: Record<string, string | number | boolean>): UrlBuilder;
    addOrReplaceParams(params: Record<string, string | number | boolean>): UrlBuilder;
    getQueryParams(): Map<string, string | number | boolean>;
    setQueryParams(query: Map<string, string | number | boolean>): UrlBuilder;
    addQueryParam(key: string, value: string | number | boolean): UrlBuilder;
    addOrReplaceQueryParam(key: string, value: string | number | boolean): UrlBuilder;
    addQueryParams(queries: Record<string, string | number | boolean>): UrlBuilder;
    addOrReplaceQueryParams(queries: Record<string, string | number | boolean>): UrlBuilder;
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
    getFirstPath(): string;
    /**
     * Get last path segment
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
     * @param withQuery true to get query params
     * @param withFragment true to get fragment
     */
    getRelativePath(withQuery?: boolean, withFragment?: boolean): string;
    /**
     * Get query params as string
     */
    getQueryString(): string;
    /**
     * Convert full UrlBuilder to string url
     */
    toString(): string;
    private static parseFile;
}
