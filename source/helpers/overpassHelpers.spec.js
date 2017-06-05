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

import {fetchTransit, fetchTransitCelled} from './overpassHelpers';
import {removeDuplicateObjectsByProp} from 'helpers/functions'
import prettyFormat from 'pretty-format'

// TODO use .resolves for all async tests whenever Jest 20 comes out, assuming it works with fork

// Move this out of if statement when testing
jest.unmock('query-overpass')
if (true) {
    // requires are used below since the jest includes aren't available at compile time
    describe("overpassHelpers unmocked", () => {

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000
        if (false)
        test('unmocked fetchTransit', () => {
            // Unmocked integration test
            const realBounds = [-118.24031352996826, 34.04298753935195, -118.21018695831297, 34.065209887879476];
            fetchTransit({realBounds}, realBounds).fork(
                error => {
                    throw new Error(prettyFormat(error))
                },
                response => {
                    expect(response.features.length > 500).toEqual(true)
                }
            )
        });
        test('unmocked fetchTransitCelled', () => {
            const realBounds = [-118.24031352996826, 34.04298753935195, -118.21018695831297, 34.065209887879476];
            // Wrap the Task in a Promise for jest's sake
            return expect(new Promise((resolve, reject) => {
                fetchTransitCelled({cellSize: 2, bounds: realBounds}, realBounds).fork(
                    error => reject(error),
                    response => resolve(response).features.length
                )
            })).resolves.toBeGreaterThan(500) // We expect over 500 results. I'll leave it fuzzy in case the source dataset changes
        });
    });
}
if (false)
describe("overpassHelpers", ()=>{

    jest.mock('query-overpass')
    const bounds = require('query-overpass').LA_BOUNDS;
    test("fetchTransit", () => {
        // Pass bounds in the options. Our mock query-overpass uses is to avoid parsing the query
        fetchTransit({testBounds: bounds}, bounds).fork(
            error => {
                throw new Error(error)
            },
            response => expect(response).toEqual(
                require('queryOverpassResponse').LA_SAMPLE
            )
        )
    });

    test("fetchTransit in cells", ()=> {
        fetchTransitCelled({cellSize: 200, testBounds: bounds}, bounds).fork(
            error => { or(error.message) },
            response => {
                expect(response.features).toEqual(
                    // the sample can have duplicate ids
                    removeDuplicateObjectsByProp('id', require('queryOverpassResponse').LA_SAMPLE.features)
                )
            }
        )
    })

});
