import {UrlBuilder} from "../src";

describe('UrlBuilder', () => {
    const url_users_paginated = 'https://localhost/users?page=1';
    const url_users_paginated_with_port = 'https://localhost:3000/users?page=1';

    const path_users_with_qp = '/users?page=1&order=ASC';

    const path_user_comments = '/users/10/comments';
    const path_user_comment = '/users/10/comments/1';

    test('should create instance', () => {
        const url: UrlBuilder = new UrlBuilder();

        expect(url).toMatchObject(new UrlBuilder());
    });

    test('should parse existing url', () => {
        const url: UrlBuilder = UrlBuilder
            .createFromUrl(url_users_paginated_with_port)
            .addQuery('order', 'DESC');

        expect(url.toString()).toBe(url_users_paginated_with_port + '&order=DESC');
    });

    test('should trim path', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(path_user_comments);

        expect(UrlBuilder.trimPath(url.getRelativePath())).toBe(path_user_comments.slice(1));
    });

    test('should compare urls', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(path_user_comments);
        const url2: UrlBuilder = UrlBuilder.createFromUrl(path_user_comments);
        const url3: UrlBuilder = UrlBuilder.createFromUrl(url_users_paginated_with_port);

        expect(url.compareTo(url2)).toBe(true);
        expect(url.compareTo(url2, false)).toBe(true);

        expect(url.compareTo(url3)).toBe(false);
        expect(url.compareTo(url3, false)).toBe(false);
    });

    test('should set port', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(url_users_paginated).setPort(3000);

        expect(url.toString()).toBe(url_users_paginated_with_port);
    });

    test('should add params', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users/:userId/comments/:commentId')
            .addParams({
                userId: 10,
                commentId: 1
            });

        expect(url.getRelativePath()).toBe(path_user_comment);
    });

    test('should get the same params', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users/:userId/comments/:commentId')
            .addParams({
                userId: 10,
                commentId: 1
            });

        expect(url.getParams().get('userId')).toEqual(10);
    });

    test('should add queries', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users')
            .addQueries({
                page: 1,
                order: 'ASC'
            });

        expect(url.getRelativePath(true)).toBe(path_users_with_qp);
    });

    test('should get the same queries', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users')
            .addQueries({
                page: 1,
                order: 'ASC'
            });

        expect(url.getQuery().get('order')).toBe('ASC');
    });

    test('should get first path', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(path_user_comments);

        expect(url.getFirstPath()).toBe('users');
    });

    test('should get last path', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(path_user_comments);

        expect(url.getLastPath()).toBe('comments');
    });

    test('should get parent', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(path_user_comment);

        expect(url.getParent().getRelativePath()).toBe(path_user_comments);
        expect(url.getParent(3).getRelativePath()).toBe('/users');
    });

    test('should get path between two words', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(path_user_comments);

        expect(url.getBetween2Words('users', 'comments')).toBe('10');
        expect(url.getBetween2Words('user', 'comment')).toBe(null);
    });

    test('should get empty relative path', () => {
        const url: UrlBuilder = new UrlBuilder();

        expect(url.getRelativePath()).toBe('');
    });


    test('should get only query in relative path', () => {
        const url: UrlBuilder = new UrlBuilder().addQuery('page', 2);

        expect(url.getRelativePath(true)).toBe('?page=2');
    });

    test('should get the same relative path', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users/:id/comments')
            .addParam('id', 10);

        expect(url.getRelativePath()).toBe(path_user_comments);
    });
});
