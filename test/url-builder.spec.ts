import { UrlBuilder } from '../src';
import { Scheme } from '../src/enums/scheme.enum';
import { QueryParams } from '../src/maps/query-params';
import { PathParams } from '../src/maps/path-params';

describe('UrlBuilder', () => {
    const base_url = 'https://localhost';

    const path_users_paginated = '/users?page=1';
    const url_users_paginated = base_url + path_users_paginated;
    const url_users_paginated_with_port = base_url + ':3000/users?page=1';

    const url_group_users_paginated = base_url + '/groups/2/users?page=1';

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
            .getQueryParams().add('order', 'DESC')
            .getBaseUrl();

        expect(url.toString()).toBe(url_users_paginated_with_port + '&order=DESC');
    });

    test('should parse existing url with default domain', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(path_users_with_qp, 'http://localhost:8080');

        expect(url.toString()).toBe('http://localhost:8080/users?page=1&order=ASC');
    });

    test('should copy url', () => {
        const usersUrl = UrlBuilder.createFromUrl(base_url).addPath('users/:id', { id: 2 });
        const ticketsUrl = usersUrl.copy().addPath('tickets').setFilename('index.html');
        const ticketsUrlWithFragment = ticketsUrl.copy().setFragment('intro');

        expect(usersUrl.toString()).toBe(base_url + '/users/2');
        expect(ticketsUrl.toString()).toBe(base_url + '/users/2/tickets/index.html');
        expect(ticketsUrlWithFragment.toString()).toBe(base_url + '/users/2/tickets/index.html#intro');
    });

    test('should compare urls', () => {
        const url: UrlBuilder = new UrlBuilder().addPath(path_user_comments);
        const url2: UrlBuilder = new UrlBuilder().addPath(path_user_comments);
        const url3: UrlBuilder = UrlBuilder.createFromUrl(url_users_paginated_with_port);

        expect(url.compareTo(url2)).toBe(true);
        expect(url.compareTo(url2, false)).toBe(true);

        expect(url.compareTo(url3)).toBe(false);
        expect(url.compareTo(url3, false)).toBe(false);
    });

    test('should compare segments', () => {
        const url: UrlBuilder = new UrlBuilder().addPath('/user');
        expect(url.compareToPathBySegment(path_user_comments)).toBe(false);

        const url2: UrlBuilder = new UrlBuilder().addPath(path_user_comments);
        expect(url2.compareToPathBySegment('/users')).toBe(false);

        const url3: UrlBuilder = new UrlBuilder().addPath(path_user_comments);
        expect(url3.compareToPathBySegment(path_user_comments)).toBe(true);

        const url4: UrlBuilder = new UrlBuilder().addPath('/users/:id/comments');
        expect(url4.compareToPathBySegment(path_user_comments)).toBe(false);

        const url5: UrlBuilder = new UrlBuilder().addPath('/users/:id/comments');
        expect(url5.compareToPathBySegment(path_user_comments, true)).toBe(true);
    });

    test('should set scheme', () => {
        const url: UrlBuilder = new UrlBuilder().setScheme(Scheme.HTTPS);

        expect(url.getScheme()).toBe(Scheme.HTTPS);
    });

    test('should set host', () => {
        const url: UrlBuilder = new UrlBuilder().setHost('localhost');

        expect(url.getHost()).toBe('localhost');
    });


    test('should set port', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(url_users_paginated).setPort(3000);

        expect(url.toString()).toBe(url_users_paginated_with_port);
        expect(url.getPort()).toBe(3000);
    });

    test('should set path segments', () => {
        const url: UrlBuilder = new UrlBuilder().setPathSegments(['users', '10', 'comments']);

        expect(url.getPathSegments()).toEqual(['users', '10', 'comments']);
    });

    test('should set path segments with params', () => {
        const url: UrlBuilder = new UrlBuilder().setPathSegments(['users', ':id', 'comments'], { id: 10 });

        expect(url.getPathSegments()).toEqual(['users', ':id', 'comments']);
        expect(url.getRelativePath()).toEqual(path_user_comments);
    });

    test('should add params', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users/:userId/comments/:commentId');

        const pathParams = url.getPathParams().setAll({
            userId: 10,
            commentId: 1
        });

        const url2: UrlBuilder = new UrlBuilder()
            .addPath('users/:userId/comments/:commentId', {
                userId: 10,
                commentId: 1
            })

        expect(url.getRelativePath()).toBe(path_user_comment);
        expect(url2.getRelativePath()).toBe(path_user_comment);

        pathParams.add('userId', 15); // Should be ignored
        expect(url.getRelativePath()).toBe(path_user_comment);

        pathParams.set('userId', 15); // Should be replaced
        expect(url.getRelativePath()).toBe('/users/15/comments/1');

        pathParams.addAll({ commentId: 2 }); // Should be ignored
        expect(url.getRelativePath()).toBe('/users/15/comments/1');

        pathParams.setAll({ commentId: 2 }); // Should be replaced
        expect(url.getRelativePath()).toBe('/users/15/comments/2');
    });

    test('should get the same params', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users/:userId/comments/:commentId')
            .getPathParams().addAll({
                userId: 10,
                commentId: 1
            })
            .getBaseUrl();

        expect(url.getPathParams().get('userId')).toEqual(10);
    });

    test('should filter params', () => {
        const pathParams = new UrlBuilder()
            .getPathParams().addAll({
                startDate: '1679737680454',
                endDate: '1679937680454',
            });

        const filteredMap = pathParams.filter(([_, value]) =>
            new Date(Number(value)).getDate() === 25
        );
        expect(filteredMap.has('startDate')).toBeTruthy();
        expect(filteredMap.has('endDate')).toBeFalsy();
    });

    test('should delete some params', () => {
        const pathParams = new UrlBuilder()
            .getPathParams().addAll({ a: 1, b: 2, c: 3, d: 4, e: 5 });

        pathParams.deleteBy(([_, value]) =>
            (value as number) % 2 === 0
        );
        const objectParams = pathParams.getAll();
        expect(objectParams).toEqual({ a: 1, c: 3, e: 5 });
    });

    test('should set the same params', () => {
        const map = new PathParams()
            .set('userId', 10).set('commentId', 1);

        const url: UrlBuilder = new UrlBuilder()
            .addPath('users/:userId/comments/:commentId')
            .setPathParams(map);

        expect(url.getPathParams()).toEqual(map);
    });

    test('should add query params', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users');
        const queryParams = url.getQueryParams().setAll({
                page: 1,
                order: 'ASC'
            });

        expect(url.getRelativePath(true)).toBe(path_users_with_qp);

        queryParams.add('page', 2); // Should be ignored
        expect(url.getRelativePath(true)).toBe(path_users_with_qp);

        queryParams.set('page', 2); // Should be replaced
        expect(url.getRelativePath(true)).toBe('/users?page=2&order=ASC');

        queryParams.addAll({ page: 3, order: 'DESC' }); // Should be ignored
        expect(url.getRelativePath(true)).toBe('/users?page=2&order=ASC');

        queryParams.setAll({ page: 3, order: 'DESC' }); // Should be replaced
        expect(url.getRelativePath(true)).toBe('/users?page=3&order=DESC');
    });

    test('should add query param by shortcut addQueryParam', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users')
            .addQueryParam('page', 1);

        expect(url.getQueryParams().has('page')).toBe(true);
    });

    test('should get the same query params', () => {
        const url: UrlBuilder = new UrlBuilder()
            .addPath('users')
            .getQueryParams().setAll({
                page: 1,
                order: 'ASC'
            })
            .getBaseUrl();

        expect(url.getQueryParams().get('order')).toBe('ASC');
    });

    test('should find query params', () => {
        const url = new UrlBuilder()
            .getQueryParams().setAll({
                style: 'dark',
                utm_source: 'Google',
                utm_medium: 'newsletter',
                utm_campaign: 'summer',
                isMobile: 1
            }).getBaseUrl();

        const filteredMap = url.getQueryParams().filter(([key]) => key.startsWith('utm'));
        expect(filteredMap.has('style')).toBeFalsy();
        expect(filteredMap.has('utm_source')).toBeTruthy();
        expect(filteredMap.has('utm_medium')).toBeTruthy();
        expect(filteredMap.has('utm_campaign')).toBeTruthy();
        expect(filteredMap.has('isMobile')).toBeFalsy();
    });

    test('should set the same query params', () => {
        const map = new QueryParams()
            .set('page', 1).set('order', 'ASC');

        const url: UrlBuilder = new UrlBuilder()
            .addPath('users')
            .setQueryParams(map);

        expect(url.getQueryParams()).toEqual(map);
    });

    test('should parse fragment', () => {
        const url: UrlBuilder = UrlBuilder
            .createFromUrl(base_url + '/books/719888217.html')
        const url2: UrlBuilder = UrlBuilder
            .createFromUrl(base_url + '/books/719888217.html', undefined, true)
        const url3: UrlBuilder = UrlBuilder
            .createFromUrl(base_url + '/books', undefined, true)

        expect(url.getFile()).toBeFalsy();
        expect(url.getPathSegments().length).toBe(2);
        expect(url2.getFile().name).toBe('719888217');
        expect(url2.getFile().ext).toBe('html');
        expect(url2.getPathSegments().length).toBe(1);
        expect(url3.getFile()).toBeFalsy();
    });

    test('should set setFilename', () => {
        const url: UrlBuilder = UrlBuilder
            .createFromUrl(base_url)
            .setFilename('719888217.html');

        expect(url.getFile().name).toBe('719888217');
        expect(url.getFile().ext).toBe('html');
    });

    test('should set setFile', () => {
        const url: UrlBuilder = UrlBuilder
            .createFromUrl(base_url)
            .setFile({ name: '719888217', ext: 'html' });

        expect(url.getFile().name).toBe('719888217');
        expect(url.getFile().ext).toBe('html');
    });

    test('should parse fragment', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(url_users_paginated_with_port + '#foo');

        expect(url.getFragment()).toBe('foo');
    });

    test('should set fragment', () => {
        const url: UrlBuilder = UrlBuilder
            .createFromUrl(url_users_paginated)
            .setFragment('bar');

        expect(url.getFragment()).toBe('bar');
        expect(url.getRelativePath(true, true)).toBe(path_users_paginated + '#bar');
        expect(url.getRelativePath()).toBe('/users');
    });

    test('should merge path with another url', () => {
        const url: UrlBuilder = UrlBuilder.createFromUrl(base_url)
            .addPath('groups');

        const anotherUrl: UrlBuilder = new UrlBuilder()
            .addPath(':id/users', { id: 2 })
            .getQueryParams().add('page', 1)
            .getBaseUrl();

        expect(url.mergePathWith(anotherUrl).toString()).toEqual(url_group_users_paginated);
    });

    test('should get first path', () => {
        const url = new UrlBuilder().addPath(path_user_comments);

        expect(url.getFirstPathSegment()).toBe('users');
    });

    test('should get last path', () => {
        const url = new UrlBuilder().addPath(path_user_comments);

        expect(url.getLastPathSegment()).toBe('comments');
    });

    test('should get parent', () => {
        const url = new UrlBuilder().addPath(path_user_comment);

        expect(url.getParent().getRelativePath()).toBe(path_user_comments);
        expect(url.getParent(3).getRelativePath()).toBe('/users');
    });

    test('should get path between two segments', () => {
        const url = new UrlBuilder().addPath(path_user_comments);

        expect(url.getBetween2Segments('users', 'comments')).toBe('10');
        expect(url.getBetween2Segments('user', 'comment')).toBe(null);
    });

    test('should get empty relative path', () => {
        const url = new UrlBuilder();

        expect(url.getRelativePath()).toBe('');
    });


    test('should get only query in relative path', () => {
        const url = new UrlBuilder()
            .getQueryParams().add('page', 2)
            .getBaseUrl();

        expect(url.getRelativePath(true)).toBe('?page=2');
    });

    test('should get the same relative path', () => {
        const url = new UrlBuilder()
            .addPath('users/:id/comments', { id: 10 });

        expect(url.getRelativePath()).toBe(path_user_comments);
    });
});
