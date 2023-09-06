# Url-Builder
![Coverage](coverage/badge.svg)

A lightweight library with many features to easy build URLs

- [Features](#bookmark_tabs-features)
- [Installation](#hammer_and_wrench-installation)
- [Usage](#memo-usage)
  - [Create from existing URL](#create-from-existing-url)
  - [Handle path](#handle-path)
  - [Handle query param](#handle-query-param)
  - [Handle file](#handle-file)
  - [Handle fragment](#handle-fragment)
  - [Work with parent](#work-with-parent)
  - [Get relative path](#get-relative-path)
  - [Get query params in string](#get-query-params-as-string)
  - [Convert full URL to string](#convert-full-url-to-string)
- [Advanced](#memo-advanced)
  - [Compare URL to another](#compare-url-to-another)
  - [Get path between two segments](#get-path-between-two-segments)
- [Utils](#memo-utils)
  - [Split path from string](#split-path-from-string)
  - [Trim path from string](#trim-path-from-string)
  - [Parse filename](#parse-filename)
- [API](#gear-api)
- [Licence](#balance_scale-licence)
- [Authors](#busts_in_silhouette-authors)
- [Contributors](#handshake-contributors)

> [!WARNING]  
> Breaking changes from 2.x to 3.x
- `UrlBuilder#addParam()` has been removed. Use `UrlBuilder#getPathParams().add()` instead
- `UrlBuilder#addParams()` has been removed. Use `UrlBuilder#getPathParams().addAll()` instead
- `UrlBuilder#addOrReplaceParam()` has been removed. Use `UrlBuilder#getPathParams().set()` instead
- `UrlBuilder#addOrReplaceParams()` has been removed. Use `UrlBuilder#getPathParams().setAll()` instead
- `UrlBuilder#findParams()` has been removed. Use `UrlBuilder#getPathParams().find()` instead
- `UrlBuilder#addQueryParam()` has been removed. Use `UrlBuilder#getQueryParams().add()` instead
- `UrlBuilder#addQueryParams()` has been removed. Use `UrlBuilder#getQueryParams().addAll()` instead
- `UrlBuilder#addOrReplaceQueryParam()` has been removed. Use `UrlBuilder#getQueryParams().set()` instead
- `UrlBuilder#addOrReplaceQueryParams()` has been removed. Use `UrlBuilder#getQueryParams().setAll()` instead
- `UrlBuilder#findQueryParams()` has been removed. Use `UrlBuilder#getQueryParams().find()` instead
- `UrlBuilder#getQueryString()` has been removed. Use `UrlBuilder#getQueryParams().toString()` instead

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
Add new path segment(s) and params
> [!NOTE]
> All methods (except getBaseUrl) on PathParams object (by `getPathParams()`), return the current PathParams object and not the current UrlBuilder object
> [!NOTE]
> The `add()` and `addAll()` methods on PathParams object does not add the entry if the key already exists. Use `set()` or `setAll()` instead
```ts
const userId = '170b16cd-ad47-4c9c-86cf-7c83bd40d775';
url.addPath(':id/comments').getPathParams().add('id', userId);
// Or
url.addPath(':id/comments', { id: userId });
```
Add multiples parameters after adding path segment(s)
```ts
const userId = '170b16cd-ad47-4c9c-86cf-7c83bd40d775';
const commentId = '218dd1c4-0bb0-425a-be0b-85427304e100';
url.addPath(':userId/comments/:commentId').getPathParams().addAll({ userId, commentId });
// Or
url.addPath(':userId/comments/:commentId', { userId, commentId });
```
If you want to add or replace existing param(s), use instead :
```ts
const userId = '170b16cd-ad47-4c9c-86cf-7c83bd40d775';
const commentId = '218dd1c4-0bb0-425a-be0b-85427304e100';
url.addPath(':userId/comments/:commentId', { userId: 3, commentId: 1 });

// Without replacement :
url.getPathParams().add('userId', userId);
// Param 'userId' is always : 3

// With replacement :
url.getPathParams().set('userId', userId);
// Param 'userId' is now : 170b16cd-ad47-4c9c-86cf-7c83bd40d775


// Or with multiples parameters
// Without replacement :
url.getPathParams().addAll({ userId: 10, commentId: 5 });
// Param 'userId' is always : 170b16cd-ad47-4c9c-86cf-7c83bd40d775
// Param 'commentId' is always : 1

// With replacement :
url.getPathParams().setAll({ userId: 10, commentId: 5 });
// Param 'userId' is now : 10
// Param 'commentId' is now : 5
```
Retrieve params
```ts
const url = new UrlBuilder()
    .getPathParams().addAll({
      startDate: '1679737680454',
      endDate: '1679937680454',
    });

const params = url.getPathParams();
// params contains all path params as Map

const filteredParams = url.getPathParams().filter(([key, value]) => new Date(Number(value)).getDate() === 25);
// filteredParams contains a new Map only with param 'startDate'
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
Delete some path params
```ts
const url = new UrlBuilder()
    .getPathParams().addAll({
      startDate: '1679737680454',
      endDate: '1679937680454',
    });

url.getPathParams().deleteBy(([key, value]) => new Date(Number(value)).getDate() === 25);
// PathParams no longer contains param 'endDate'
```

### Handle query param
> [!NOTE]
> All methods (except getBaseUrl) on QueryParams object (by `getQueryParams()`), return the current QueryParams object and not the current UrlBuilder object
>
> [!NOTE]
> The `add()` and `addAll()` methods on QueryParams object does not add the entry if the key already exists. Use `set()` or `setAll()` instead
Add new query param
```ts
const page = 2;
url.getQueryParams().add('page', page);
```
Add multiples query params
```ts
const page = 2;
const order = 'DESC';
url.getQueryParams().addAll({ page, order });
```
If you want to add or replace existing query, use instead :
```ts
const page = 2;
const order = 'DESC';
url.getQueryParams().addAll({ page, order });

// Without replacement :
url.getQueryParams().add('page', 3);
// QueryParam 'page' is always : 2

// With replacement :
url.getQueryParams().set('page', 3);
// QueryParam 'page' is now : 3


// Or with multiples parameters
// Without replacement :
url.getQueryParams().addAll({ page: 4, order: 'ASC' });
// QueryParam 'page' is always : 3
// QueryParam 'order' is always : DESC

// With replacement :
url.getQueryParams().setAll({ page: 4, order: 'ASC' });
// QueryParam 'page' is now : 4
// QueryParam 'order' is now : ASC
```
Retrieve query params
```ts
const url = new UrlBuilder()
    .getQueryParams().addAll({
      style: 'dark',
      utm_source: 'Google',
      utm_medium: 'newsletter',
      utm_campaign: 'summer',
      isMobile: 1
    });

const queryParams = url.getQueryParams();
// queryParams contains all query params as Map

const filteredQueryParams = url.getQueryParams().filter(([key]) => key.startsWith('utm'));
// filteredQueryParams contains a new Map only with query params 'utm_source', 'utm_medium' and 'utm_campaign'
```
Delete some query params
```ts
const url = new UrlBuilder()
    .getQueryParams().addAll({
      style: 'dark',
      utm_source: 'Google',
      utm_medium: 'newsletter',
      utm_campaign: 'summer',
      isMobile: 1
    });

url.getQueryParams().deleteBy(([key]) => key.startsWith('utm'));
// QueryParams no longer contains query params 'utm_source', 'utm_medium' and 'utm_campaign'
```

### Handle file
Parse file in url
```ts
// Consider file part of path segments
const url = UrlBuilder.createFromUrl('http://localhost/users/10.html');
url.getRelativePath();
// Output : /users/10.html
url.getPathSegments();
// Output : ['users', '10.html'];
url.getFile();
// Output : undefined

// Consider file dissociated of path segments
const url2 = UrlBuilder.createFromUrl('http://localhost/users/10.html', true);
url2.getRelativePath();
// Output : /users/10.html
url2.getPathSegments();
// Output : ['users'];
url2.getFile();
// Output : { name: '10', ext: 'html' }
```
Define file
```ts
url.setFile({ name: 'mycover', ext: 'webp' });
url.getFile();
// Output : { name: 'mycover', ext: 'webp' }
```
Define file from filename
```ts
url.setFilename('mycover.webp');
url.getFile();
// Output : { name: 'mycover', ext: 'webp' }
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
Retrieve the relative path as string format
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

### Get query params as string
Retrieve the query params as string format
```ts
const url = UrlBuilder.createFromUrl('http://localhost:8080/vehicles').addQueryParams({
  page: 2,
  order: 'ASC',
});
url.getQueryParams().toString(); // Output: '?page=2&order=ASC'
```

### Convert full URL to string
Retrieve the query params as string format
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

### Get path between two segments
```ts
const url = UrlBuilder.createFromUrl('http://localhost:8080/users/10/comments');
url.getBetween2Segments('users', 'comments'); // Output: 10

const url2 = UrlBuilder.createFromUrl('http://localhost:8080/users/10/comments/5');
url2.getBetween2Segments('users', '5'); // Output: 10/comments
```

## :memo: Utils
### Split path from string
Split path string by slash
```ts
UrlUtils.splitPath('/InnovA2/url-builder/pulls/'); // Output: ['InnovA2', 'url-builder', 'pulls']
// or if you have more slashes
UrlUtils.splitPath('/InnovA2///url-builder/pulls/'); // Output: ['InnovA2', 'url-builder', 'pulls']
```

### Trim path from string
Trim path string by removing useless slashes

```ts
UrlUtils.trimPath('/InnovA2/url-builder/pulls/'); // Output: 'InnovA2/url-builder/pulls'
// or if you have more slashes
UrlUtils.trimPath('/InnovA2///url-builder/pulls/'); // Output: 'InnovA2/url-builder/pulls'
```

### Parse filename
Parse filename to create file object containing 'name' and 'ext' (extension).
Works with any extension (no verification).
```ts
UrlUtils.parseFile('image.png'); // Output: { name: 'image', ext: 'png' }
```
    
## :gear: API
### Types / Interfaces
```ts
type ParamType = string | number | boolean;
type ParamFindPredicate = (value: [string, ParamType], index: number, obj: [string, ParamType][]) => boolean;
interface FileInterface {
  name: string;
  ext: string;
}
```

### UrlBuilder
```ts
static createFromUrl(baseUrl: string, isFile?: boolean): UrlBuilder;
copy(): UrlBuilder;
compareTo(url: UrlBuilder, relative?: boolean): boolean;
compareToPathBySegment(path: string, validateUnfilledParams?: boolean): boolean;
getScheme(): Scheme;
setScheme(scheme: Scheme): this;
getHost(): string;
setHost(host: string): this;
getPort(): number;
setPort(port: number): this;
getPathSegments(): string[];
setPathSegments(segments: string[], params?: Record<string, ParamType>): UrlBuilder;
addPath(path: string, params?: Record<string, ParamType>): UrlBuilder;
getPathParams(): PathParams;
setPathParams(params: PathParams): this;
getQueryParams(): QueryParams;
setQueryParams(query: QueryParams): this;
setFilename(filename: string): this;
setFile(file: IFile): this;
getFile(): IFile;
getFragment(): string;
setFragment(fragment: string): this;
mergePathWith(url: UrlBuilder): this;
getFirstPathSegment(): string;
getFirstPath(): string;
getLastPathSegment(): string;
getLastPath(): string;
getParent(n?: number): UrlBuilder;
getBetween2Segments(a: string, b: string): string | null;
getRelativePath(withQuery?: boolean, withFragment?: boolean): string;
toString(): string;
```
> **Note** : Only the non-static getParent() method return new instance of UrlBuilder. Others update and return the current instance.

### PathParams (`extends Map<string, ParamType>`)
```ts
constructor(baseUrl?: UrlBuilder, entries?: readonly (readonly [string, ParamType])[] | null);
getAll(): { [key: string]: ParamType };
add(key: string, value: ParamType): this;
addAll(params: Record<string, ParamType>): this;
setAll(params: Record<string, ParamType>): this;
deleteBy(predicate: ParamFindPredicate): this;
getBaseUrl(): UrlBuilder;
filter(predicate: ParamFindPredicate): PathParams;
```

### QueryParams (`extends Map<string, ParamType>`)
```ts
constructor(baseUrl?: UrlBuilder, entries?: readonly (readonly [string, ParamType])[] | null);
getAll(): { [key: string]: ParamType };
add(key: string, value: ParamType): this;
addAll(params: Record<string, ParamType>): this;
setAll(params: Record<string, ParamType>): this;
deleteBy(predicate: ParamFindPredicate): this;
getBaseUrl(): UrlBuilder;
filter(predicate: ParamFindPredicate): QueryParams;
toString(): string;
```

### UrlUtils (namespace)
```ts
splitPath(path: string): string[];
trimPath(path: string): string;
parseFile = (filename: string): FileInterface;
```

## :balance_scale: Licence
[MIT](LICENSE)

## :busts_in_silhouette: Authors
- [Adrien MARTINEAU](https://github.com/WaZeR-Adrien)
- [Angéline TOUSSAINT](https://github.com/AngelineToussaint)

## :handshake: Contributors
Do not hesitate to participate in the project!
Contributors list will be displayed below.
