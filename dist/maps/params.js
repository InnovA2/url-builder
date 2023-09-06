"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Params = void 0;
class Params extends Map {
    constructor(baseUrl, entries) {
        super(entries);
        this.baseUrl = baseUrl;
    }
    /**
     * Get all values as object
     */
    getAll() {
        return Object.fromEntries(this.entries());
    }
    /**
     * Add new entry if not exists.
     * @param key
     * @param value
     */
    add(key, value) {
        if (!this.has(key)) {
            this.set(key, value);
        }
        return this;
    }
    /**
     * Add multiple entries if they don't exist
     * @param params
     */
    addAll(params) {
        Object.entries(params)
            .forEach(([key, value]) => this.add(key, value));
        return this;
    }
    /**
     * Set multiple entries
     * @param params
     */
    setAll(params) {
        Object.entries(params)
            .forEach(([key, value]) => this.set(key, value));
        return this;
    }
    /**
     * Delete some entries by predicate
     * @param predicate
     */
    deleteBy(predicate) {
        const entries = [...this.entries()];
        entries.filter(predicate).forEach(([key, value]) => this.delete(key));
        return this;
    }
    getBaseUrl() {
        return this.baseUrl;
    }
}
exports.Params = Params;
