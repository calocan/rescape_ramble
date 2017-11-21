/**
 * Created by Andy Likuski on 2017.04.03
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {Map, fromJS} = require('immutable');
const {PARIS_BOUNDS, LA_BOUNDS, PARIS_SAMPLE, LA_SAMPLE} = require('async/queryOverpass.sample')

// Use Map for equality matching of keys
const responses = Map([
    [fromJS(PARIS_BOUNDS), PARIS_SAMPLE],
    [fromJS(LA_BOUNDS), LA_SAMPLE],
]);
const getResponse = (bounds) => responses.get(fromJS(bounds));

/**
 * Mocks the query_overpass method,
 * accepting an extra options.bounds argument to save parsing the bounds from the query
 * @param query
 * @param cb
 * @param options
 * @param options.testBounds Required for testing
 * @return {Promise}
 */
module.exports = (query, cb, options) => {
    const response = getResponse(options.testBounds);
    process.nextTick(
        () => response ?
            cb(undefined, response) :
            cb({
                   message: "Bounds don't match any mock response",
                   statusCode: 404
            })
   );
};
