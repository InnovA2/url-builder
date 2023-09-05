import { ParamFindPredicate, ParamType } from '../types';
import { UrlBuilder } from '../url-builder';

export abstract class Params extends Map<string, ParamType> {
    protected readonly baseUrl?: UrlBuilder;

    constructor(baseUrl?: UrlBuilder, entries?: readonly (readonly [string, ParamType])[] | null) {
        super(entries);

        this.baseUrl = baseUrl;
    }

    getAll() {
        return Object.fromEntries(this.entries());
    }

    add(key: string, value: ParamType): this {
        if (!this.has(key)) {
            this.set(key, value);
        }
        return this;
    }

    addAll(params: Record<string, ParamType>): this {
        Object.entries(params)
            .forEach(([key, value]) => this.add(key, value));

        return this;
    }

    setAll(params: Record<string, ParamType>): this {
        Object.entries(params)
            .forEach(([key, value]) => this.set(key, value));

        return this;
    }

    deleteBy(predicate: ParamFindPredicate): this {
        const entries = [...this.entries()]
            .filter((entry, i, all) => !predicate(entry, i, all));

        this.clear();
        entries.forEach(([key, value]) => this.set(key, value));

        return this;
    }

    getBaseUrl(): UrlBuilder {
        return this.baseUrl;
    }
}