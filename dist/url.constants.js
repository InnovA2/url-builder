"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlConstants = void 0;
var UrlConstants;
(function (UrlConstants) {
    UrlConstants.REGEX_BRACE_PARAMS = /({)(.*?)(})/g;
    UrlConstants.REGEX_FILENAME = /(.+)(\.[a-zA-Z0-9]+)$/;
    UrlConstants.URL_PATH_PREFIX = ':';
    UrlConstants.URL_PATH_SEPARATOR = '/';
    UrlConstants.URL_EXT_SEPARATOR = '.';
})(UrlConstants = exports.UrlConstants || (exports.UrlConstants = {}));
