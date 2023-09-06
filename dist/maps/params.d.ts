import { ParamFindPredicate, ParamType } from '../types';
import { UrlBuilder } from '../url-builder';
export declare abstract class Params extends Map<string, ParamType> {
    protected readonly baseUrl?: UrlBuilder;
    constructor(baseUrl?: UrlBuilder, entries?: readonly (readonly [string, ParamType])[] | null);
    /**
     * Get all values as object
     */
    getAll(): {
        [key: string]: ParamType;
    };
    /**
     * Add new entry if not exists.
     * @param key
     * @param value
     */
    add(key: string, value: ParamType): this;
    /**
     * Add multiple entries if they don't exist
     * @param params
     */
    addAll(params: Record<string, ParamType>): this;
    /**
     * Set multiple entries
     * @param params
     */
    setAll(params: Record<string, ParamType>): this;
    /**
     * Delete some entries by predicate
     * @param predicate
     */
    deleteBy(predicate: ParamFindPredicate): this;
    getBaseUrl(): UrlBuilder;
}
