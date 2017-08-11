/**
 * Created by Andy Likuski on 2017.07.03
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const {reqPath} = require('./functions');
const {Either} = require('ramda-fantasy');
const R = require('ramda');
const prettyFormat = require('pretty-format');

/**
 * Calls functions.reqPath and throws if the reqPath does not resolve to a non-nil
 * reqPath:: string -> obj -> a or throws
 */
module.exports.reqPath = R.curry((path, obj) =>
    R.compose(
        R.ifElse(
            Either.isLeft,
            either => {
                throw new Error(
                    [either.value.resolved.length ?
                        `Only found non-nil path up to ${either.value.resolved.join('.')}` :
                        'Found no non-nil value of path',
                    `of ${path.join('.')} for obj ${prettyFormat(obj)}`
                    ].join(' ')
            );
},
            either => either.value,
        ),
        reqPath(path)
    )(obj)
);
