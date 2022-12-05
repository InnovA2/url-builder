import { Scheme } from './enums/scheme.enum';
export declare class UrlBuilder {
    private scheme;
    private host;
    private port;
    private pathSegments;
    private params;
    private query;
    private fragment;
    static createFromUrl(baseUrl: string): UrlBuilder;
    static splitPath(path: string): string[];
    static trimPath(path: string): string;
    compareTo(url: UrlBuilder, relative?: boolean): boolean;
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
    getFragment(): string;
    setFragment(fragment: string): UrlBuilder;
    mergePathWith(url: UrlBuilder): UrlBuilder;
    getFirstPath(): string;
    getLastPath(): string;
    getParent(n?: number): UrlBuilder;
    getBetween2Words(a: string, b: string): string;
    getRelativePath(withQuery?: boolean, withFragment?: boolean): string;
    getQueryString(): string;
    toString(): string;
}
