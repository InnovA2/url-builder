import { IFile } from './types';
export declare namespace UrlUtils {
    /**
     * Split path in segments by slash
     * @param path relative path to split
     */
    const splitPath: (path: string) => string[];
    /**
     * Trim path (e.g. /users/:id/ -> user/:id)
     * @param path relative path to trim
     */
    const trimPath: (path: string) => string;
    /**
     * Parse filename to create file object containing name and ext (extension)
     * @param filename filename to parse
     */
    const parseFile: (filename: string) => IFile;
}
