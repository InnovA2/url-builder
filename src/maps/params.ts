import { ParamFindPredicate, ParamType } from '../types';
import { UrlBuilder } from '../url-builder';

export abstract class Params extends Map<string, ParamType> {
    protected readonly baseUrl?: UrlBuilder;

    constructor(baseUrl?: UrlBuilder, entries?: readonly (readonly [string, ParamType])[] | null) {
        super(entries);

        this.baseUrl = baseUrl;
    }

    /**
     * Get all values as object
     */
    getAll(): { [key: string]: ParamType } {
        return Object.fromEntries(this.entries());
    }

    /**
     * Add new entry if not exists.
     * @param key
     * @param value
     */
    add(key: string, value: ParamType): this {
        if (!this.has(key)) {
            this.set(key, value);
        }
        return this;
    }

    /**
     * Add multiple entries if they don't exist
     * @param params
     */
    addAll(params: Record<string, ParamType>): this {
        Object.entries(params)
            .forEach(([key, value]) => this.add(key, value));

        return this;
    }

    /**
     * Set multiple entries
     * @param params
     */
    setAll(params: Record<string, ParamType>): this {
        Object.entries(params)
            .forEach(([key, value]) => this.set(key, value));

        return this;
    }

    /**
     * Delete some entries by predicate
     * @param predicate
     */
    deleteBy(predicate: ParamFindPredicate): this {
        const entries = [...this.entries()];
        entries.filter(predicate).forEach(([key, value]) => this.delete(key));

        return this;
    }

    getBaseUrl(): UrlBuilder {
        return this.baseUrl;
    }
}