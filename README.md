# Url-Builder
![Coverage](coverage/badge.svg)

A lightweight library with many features to easy build URLs

- [Features](#bookmark_tabs-features)
- [Installation](#hammer_and_wrench-installation)
- [Usage](#memo-usage)
  - [Create from existing URL](#create-from-existing-url)
  - [Handle path](#handle-path)
  - [Handle query param](#handle-query-param)
  - [Work with parent](#work-with-parent)
  - [Get relative path](#get-relative-path)
  - [Get query params in string](#get-query-params-in-string)
  - [Convert full URL to string](#convert-full-url-to-string)
- [Advanced](#memo-advanced)
  - [Compare URL to another](#compare-url-to-another)
  - [Get word between two others](#get-word-between-two-others)
  - [Split path from string (static)](#split-path-from-string-static)
  - [Trim path from string (static)](#trim-path-from-string-static)
- [API](#gear-api)
- [Licence](#balance_scale-licence)
- [Authors](#busts_in_silhouette-authors)
- [Contributors](#handshake-contributors)

**Breaking changes from 1.x to 2.x :**
- `UrlBuilder#addParam` does not replace existing param now. Use `UrlBuilder#addOrReplaceParam` now
- `UrlBuilder#addParams` does not replace existing params now. Use `UrlBuilder#addOrReplaceParams` now
- `UrlBuilder#addQueryParam` does not replace existing param now. Use `UrlBuilder#addOrReplaceQueryParam` now
- `UrlBuilder#addQueryParams` does not replace existing params now. Use `UrlBuilder#addOrReplaceQueryParams` now

## :bookmark_tabs: Features
This library allows :
- Create URLs most easly
- Parse and decompose your URLs
- Ride up in the URL tree
- Make comparisons between URLs

## :hammer_and_wrench: Installation
To import the library you just need to run this command :
```shell
npm install @innova2/url-builder
```

## :memo: Usage
### Create from existing URL
```ts
const url = UrlBuilder.createFromUrl('http://localhost:8080/users');
// or create new url with the constructor
```

### Handle path
Add new path segment(s)
```ts
const userId = '170b16cd-ad47-4c9c-86cf-7c83bd40d775';
url.addPath(':id/comments').addParam('id', userId);
// Or
url.addPath(':id/comments', { id: userId });
```
Add multiples parameters after adding path segment(s)
```ts
const userId = '170b16cd-ad47-4c9c-86cf-7c83bd40d775';
const commentId = '218dd1c4-0bb0-425a-be0b-85427304e100';
url.addPath(':userId/comments/:commentId').addParams({ userId, commentId });
// Or
url.addPath(':userId/comments/:commentId', { userId, commentId });
```
If you want to add or replace existing param, use instead :
```ts
const userId = '170b16cd-ad47-4c9c-86cf-7c83bd40d775';
const commentId = '218dd1c4-0bb0-425a-be0b-85427304e100';
url.addPath(':userId/comments/:commentId')
        .addParams({ userId: 3, commentId: 1 });

// Without replacement :
url.addParam('userId', userId);
// Param 'userId' is always : 3

// With replacement :
url.addOrReplaceParam('userId', userId);
// Param 'userId' is now : 170b16cd-ad47-4c9c-86cf-7c83bd40d775


// Or with multiples parameters
// Without replacement :
url.addParams({ userId: 10, commentId: 5 });
// Param 'userId' is always : 170b16cd-ad47-4c9c-86cf-7c83bd40d775
// Param 'commentId' is always : 1

// With replacement :
url.addOrReplaceParams({ userId: 10, commentId: 5 });
// Param 'userId' is now : 10
// Param 'commentId' is now : 5
```
Get the first path segment
```ts
const rowNum = 10;
const url = UrlBuilder.createFromUrl('http://localhost:8080/rows/:rowNum/cells').addParam('rowNum', rowNum);
url.getFirstPath(); // Output: 'rows'
```
Get the last path segment
```ts
url.getLastPath(); // Output: 'cells'
```

### Handle query param
Add new query param
```ts
const page = 2;
url.addQueryParam('page', page);
```
Add multiples query params
```ts
const page = 2;
const order = 'DESC';
url.addQueryParams({ page, order });
```
If you want to add or replace existing query, use instead :
```ts
const page = 2;
const order = 'DESC';
url.addQueryParams({ page, order });

// Without replacement :
url.addQueryParam('page', 3);
// QueryParam 'page' is always : 2

// With replacement :
url.addOrReplaceQueryParam('page', 3);
// QueryParam 'page' is now : 3


// Or with multiples parameters
// Without replacement :
url.addQueryParams({ page: 4, order: 'ASC' });
// QueryParam 'page' is always : 3
// QueryParam 'order' is always : DESC

// With replacement :
url.addOrReplaceQueryParams({ page: 4, order: 'ASC' });
// QueryParam 'page' is now : 4
// QueryParam 'order' is now : ASC
```

### Handle fragment
Parse fragment with url
```ts
const url = UrlBuilder.createFromUrl('http://localhost/users?page=1#foo');
url.getRelativePath(false, true);
// Output : /users#foo
// The first boolean is "withQuery" and the seconde is "withFragment"
// With query params and fragment :
url.getRelativePath(true, true);
// Output : /users?page=1#foo
```
Define fragment without hash
```ts
url.setFragment('bar');
```
Retrieve fragment
```ts
const fragment = url.getFragment();
// Output : bar
url.getRelativePath(false, true);
// Output : /users#bar
```

### Merge path and query params
It's possible to merge path and query params with another url
```ts
const url = UrlBuilder.createFromUrl('http://localhost:3000').addPath('groups');

const anotherUrl = new UrlBuilder()
    .addPath(':id/users', { id: 2 })
    .addQueryParam('page', 1)

url.mergePathWith(anotherUrl).toString() // Get 'http://localhost:3000/groups/2/users?page=1'
```
> **Note** : This function merge only path, params and query params with current url.


### Work with parent
Get parent URL easly.<br>
*This function return a new instance of UrlBuilder*
```ts
const url = UrlBuilder.createFromUrl('http://localhost:8080/orders/:orderId/products/:productId');
const parent = url.getParent(); // Get 'http://localhost:8080/orders/:orderId/products'
```
Or up to the specific level
```ts
url.getParent(3); // Get 'http://localhost:8080/orders'
```

### Get relative path
Retrieve the relative path in string format
```ts
const postId = 'a937b39e-9664-404a-ac56-f3da2b83a951';
const url = UrlBuilder.createFromUrl('http://localhost:8080/posts/:id').addParam('id', postId);
url.getRelativePath(); // Output: '/posts/a937b39e-9664-404a-ac56-f3da2b83a951'
```
And with query params<br>
*Don't forget to add 'true' parameter to allow query params conversion*
```ts
url.addQueryParam('displaySimilar', true);
url.getRelativePath(); // Output: '/posts/a937b39e-9664-404a-ac56-f3da2b83a951'
url.getRelativePath(true); // Output: '/posts/a937b39e-9664-404a-ac56-f3da2b83a951?displaySimilar=true'
```

### Get query params in string
Retrieve the query params in string format
```ts
const url = UrlBuilder.createFromUrl('http://localhost:8080/vehicles').addQueryParams({
  page: 2,
  order: 'ASC',
});
url.getQueryString(); // Output: '?page=2&order=ASC'
```

### Convert full URL to string
Retrieve the query params in string format
```ts
const name = 'url-builder';
const url = UrlBuilder.createFromUrl('https://github.com/InnovA2')
        .addPath(':name/pulls')
        .addParam('name', name);
url.toString(); // Output: 'https://github.com/InnovA2/url-builder/pulls'
```

## :memo: Advanced
### Compare URL to another
Compare the current URL to another URL (UrlBuilder instance)
```ts
const id = '434f65eb-4e5f-4b29-899c-b3e159fff61c';
const id2 = '3e972ca2-b422-4ac9-b793-e6f305c7bfb2';
const url = UrlBuilder.createFromUrl('http://localhost:8080/users/:id').addParam('id', id);
const url2 = UrlBuilder.createFromUrl('http://localhost:8080/users/:id').addParam('id', id);
const url3 = UrlBuilder.createFromUrl('http://localhost:8080/users/:id').addParam('id', id2);
url.compareTo(url2); // Output: true
url.compareTo(url3); // Output: false
```

### Compare relative path to another by segment
Compare the path segments of the current URL to another relative path
```ts
const url: UrlBuilder = UrlBuilder.createFromUrl('/users/10/comments');
url.compareToPathBySegment('/users/10/comments') // Output: true
const url2: UrlBuilder = UrlBuilder.createFromUrl('/users/:id/comments');
url2.compareToPathBySegment('/users/10/comments') // Output: false
const url3: UrlBuilder = UrlBuilder.createFromUrl('/users/:id/comments').addParam('id', 10);
url3.compareToPathBySegment('/users/10/comments') // Output: true
// Or, validate unfilled params
const url4: UrlBuilder = UrlBuilder.createFromUrl('/users/:id/comments');
url4.compareToPathBySegment('/users/10/comments', true) // Output: true
```

### Get segments between two others
Get the segments path between two segments
```ts
const url = UrlBuilder.createFromUrl('http://localhost:8080/users/10/comments');
url.getBetween2Segments('users', 'comments'); // Output: 10

const url2 = UrlBuilder.createFromUrl('http://localhost:8080/users/10/comments/5');
url2.getBetween2Segments('users', '5'); // Output: 10/comments
```

### Split path from string (static)
Split path string by slash
```ts
UrlBuilder.splitPath('/InnovA2/url-builder/pulls/'); // Output: ['InnovA2', 'url-builder', 'pulls']
// or if you have more slashes
UrlBuilder.splitPath('/InnovA2///url-builder/pulls/'); // Output: ['InnovA2', 'url-builder', 'pulls']
```

### Trim path from string (static)
Trim path string by removing useless slashes
```ts
UrlBuilder.trimPath('/InnovA2/url-builder/pulls/'); // Output: 'InnovA2/url-builder/pulls'
// or if you have more slashes
UrlBuilder.trimPath('/InnovA2///url-builder/pulls/'); // Output: 'InnovA2/url-builder/pulls'
```
    
## :gear: API
```ts
static createFromUrl(baseUrl: string): UrlBuilder
static splitPath(path: string): string[]
static trimPath(path: string): string
compareTo(url: UrlBuilder, relative = true): boolean
compareToPathBySegment(path: string, validateUnfilledParams = false): boolean
getScheme(): Scheme
setScheme(scheme: Scheme): UrlBuilder
getHost(): string
setHost(host: string): UrlBuilder
getPort(): numbe
setPort(port: number): UrlBuilder
getPathSegments(): string[]
setPathSegments(segments: string[], params: Record<string, string | number>): UrlBuilder
addPath(path: string, params: Record<string, string | number>): UrlBuilder
getParams(): Map<string, string | number>
setParams(params: Map<string, string | number>): UrlBuilder
addParam(key: string, value: string | number): UrlBuilder
addParams(params: Record<string, string | number>): UrlBuilder
getParams(): Map<string, string | number>
getQueryParams(): Map<string, string | number>
setQueryParams(query: Map<string, string | number>): UrlBuilder
addQueryParam(key: string, value: string | number): UrlBuilder
addQueryParams(queries: Record<string, string | number>): UrlBuilder
getQueryParams(): Map<string, string | number>
mergePathWith(url: UrlBuilder): UrlBuilder
getFirstPath(): string
getLastPath(): string
getParent(n = 1): UrlBuilder
getBetween2Segments(a: string, b: string): string
getRelativePath(query = false): string
getQueryString(): string
toString(): string
```
> **Note** : Only the non-static getParent() method return new instance of UrlBuilder. Others update and return the current instance.

## :balance_scale: Licence
[MIT](LICENSE)

## :busts_in_silhouette: Authors
- [Adrien MARTINEAU](https://github.com/WaZeR-Adrien)
- [Angéline TOUSSAINT](https://github.com/AngelineToussaint)

## :handshake: Contributors
Do not hesitate to participate in the project!
Contributors list will be displayed below.
