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

import query_overpass from 'query-overpass';
import Task from 'data.task'
import {futurizer as Future} from 'futurizer'
import R from 'ramda';
import os from 'os';
import squareGrid from '@turf/square-grid';
import bbox from '@turf/bbox';

/***
 * fetches transit data from OpenStreetMap using the Overpass API.
 * @param {Number} cellSize Splits query-overpass into separate requests, by splitting
 * the bounding box by the number of kilometers specified here. Example, if 200 is specified,
 * 200 by 200km bounding boxes will be created and sent to query-overpass. Any remainder will
 * be queried separately. The results from all queries are merged by feature id so that no
 * duplicates are returned.
 * @param {Object} options Options to pass to query-overpass, plus the following:
 * @param {Object} options.bounds Used only for testing
 * @param {Array} bounds [lat_min, lon_min, lat_max, lon_max]
 *
 */
export const fetchTansitCelled = (cellSize, options, bounds) => {
    const units = 'kilometers';
    const squares = R.map(
        polygon => bbox(polygon),
        squareGrid(bounds, cellSize, units).features);
    const concatValues = (k, l, r) => k == 'features' ? R.concat(l, r) : r;
    return R.traverse(Task.of, fetchTransit(options), squares).chain(
        (results) => Task.of(R.mergeWithKey(concatValues, results))
    )
};

/***
 * fetches transit data from OpenStreetMap using the Overpass API.
 * @param {Object} options Options to pass to query-overpass, plus the following:
 * @param {Object} options.bounds Used only for testing
 * @param {Array} bounds [lat_min, lon_min, lat_max, lon_max]
 */
export const fetchTransit = R.curry((options, bounds) => {

    const boundsAsString = `(${bounds.join(',')})`;
    const query = boundsString => `
    [out:xml];
    (
        ${R.pipe(R.map(type => `
        ${type} 
            ["railway"]
            ["service" != "siding"]
            ["service" != "spur"]
            ({{${boundsString}}});
        `),
        R.join(os.EOL))(['node', 'way', 'rel'])}
    );
    // print results
    out meta;/*fixed by auto repair*/
    >;
    out meta qt;/*fixed by auto repair*/
    `;
    return new Task(function(reject, resolve) {
        query_overpass(query(boundsAsString), (error, data) => {
            if (!error) {
                resolve(data);
            }
            else {
                reject(error);
            }
        }, options);
    });
});


