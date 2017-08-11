/**
 * Created by Andy Likuski on 2017.06.19
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const xhr = require('xhr');
const Task = require('data.task');

/**
 * Uses Mapbox to resolve locations based on a search string
 * @param {String} endpoint The Endpoint
 * @param {String} source The source
 * @param {String} accessToken The accessToken
 * @param {String} proximity The proximity
 * @param {String} query The query
 * @returns {Object} A Task to query for the search results
 */
module.exports.searchLocation = (endpoint, source, accessToken, proximity, query) => dispatch => {
    return new Task((reject, response) => {
        const uri = `${endpoint}/geocoding/v5/${source}/${encodeURIComponent(query)}.json?access_token=${accessToken}${(proximity ? '&proximity=' + proximity : '')}`;
        xhr({
            uri: uri,
            json: true
        }, function (err, res, body) {
            if (err) {
                reject(err);
            } else {
                response(body);
            }
        });
    });
};
