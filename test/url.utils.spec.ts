import { UrlUtils } from '../src/url.utils';

describe('UrlUtils', () => {
    const path_user_comments = '/users/10/comments';

    test('should split path', () => {
        const segments = UrlUtils.splitPath(path_user_comments);
        expect(segments).toEqual(['users', '10', 'comments']);
    });

    test('should trim path', () => {
        expect(UrlUtils.trimPath(path_user_comments)).toBe(path_user_comments.slice(1));
    });

    test('should parse filename', () => {
        expect(UrlUtils.parseFile('image.png')).toEqual({ name: 'image', ext: 'png' });
    });

    test('shouldn\'t parse filename', () => {
        expect(UrlUtils.parseFile('image')).toBeNull();
    });
});
