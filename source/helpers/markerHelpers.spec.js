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

import {fetchMarkers, fetchMarkersCelled} from './markerHelpers';
import {removeDuplicateObjectsByProp} from 'helpers/functions'
jest.mock('./markerHelpers')

// TODO use .resolves for all async tests whenever Jest 20 comes out, assuming it works with fork

describe("markerHelpers", ()=>{

    const bounds = require('query-overpass').LA_BOUNDS;
    test("fetchMarkers", () => {
        // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
        expect(new Promise((resolve, reject) => {
            fetchMarkers({testBounds: bounds}, bounds).fork(
                error => {
                    throw new reject(error)
                },
                response => {
                    return resolve(response)
                }
            )
        })).resolves.toEqual(require('queryOverpassResponse').LA_SAMPLE)
    });

    test("fetchMarker in cells", ()=> {
        expect(new Promise((resolve, reject) => {
            fetchMarkersCelled({cellSize: 200, testBounds: bounds}, bounds).fork(
                error => { reject(error) },
                response => resolve(response.features)
            )
        })).resolves.toEqual(
            // the sample can have duplicate ids
            removeDuplicateObjectsByProp('id', require('queryOverpassResponse').LA_SAMPLE.features)
        )
    })
});
