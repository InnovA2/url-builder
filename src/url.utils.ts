import { UrlConstants } from './url.constants';
import { FileInterface } from './file.interface';

export namespace UrlUtils {
    /**
     * Split path in segments by slash
     * @param path relative path to split
     */
    export const splitPath = (path: string): string[] => {
        return path.split(UrlConstants.URL_PATH_SEPARATOR)
            .filter(segment => segment)
            .map(segment => segment.replace(UrlConstants.REGEX_BRACE_PARAMS, `${UrlConstants.URL_PATH_PREFIX}$2`));
    }

    /**
     * Trim path (e.g. /users/:id/ -> user/:id)
     * @param path relative path to trim
     */
    export const trimPath = (path: string): string => {
        return splitPath(path).join(UrlConstants.URL_PATH_SEPARATOR);
    }

    /**
     * Parse filename to create file object containing name and ext (extension)
     * @param filename filename to parse
     */
    export const parseFile = (filename: string): FileInterface => {
        const matchType = filename.match(UrlConstants.REGEX_FILENAME);
        if (matchType && matchType.length > 2) {
            return {
                name: matchType[1],
                ext: matchType[2].replace(/\./, '')
            };
        }
        return null;
    }
}
