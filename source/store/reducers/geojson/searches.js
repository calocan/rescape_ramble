/**
 * Created by Andy Likuski on 2017.06.15
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import xhr from 'xhr'
const SEARCH_LOCATION = '/geojson/SEARCH_LOCATION';
const SEARCH_LOCATION_DATA = '/geojson/SEARCH_LOCATION_DATA';
const SEARCH_LOCATION_SUCCESS = '/geojson/SEARCH_LOCATION_SUCCESS';
const SEARCH_LOCATION_FAILURE = '/geojson/SEARCH_LOCATION_FAILURE';

export const searchLocation = (endpoint, source, accessToken, proximity, query) => dispatch => {
    return new Task((reject, response) => {
        const searchTime = new Date();
        const uri = `${endpoint}/geocoding/v5/${source}/${encodeURIComponent(query)}.json?access_token=${accessToken}${(proximity ? '&proximity=' + proximity : '')}`;
        xhr({
            uri: uri,
            json: true
        }, function (err, res, body) {
            if (err)
                reject(err)
            else {
                dispatch(searchLocationSuccess(body));
                response(res, body, searchTime)
            }
        });
    });
}

const searchLocationSuccess = body => ({ type: SEARCH_LOCATION_SUCCESS, body });

export const searchLocationFailure = ex => ({ type: SEARCH_LOCATION_FAILURE, ex });

export default (state = {}, action = {}) => {
    switch (action.type) {
        default:
            return state;
    }
};