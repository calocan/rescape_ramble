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
import R from 'ramda';
import {mergeAllWithKey, removeDuplicateObjectsByProp} from 'helpers/functions';
import os from 'os';
import squareGrid from '@turf/square-grid';
import bbox from '@turf/bbox';

/***
 * fetches transit data in squares sequentially from OpenStreetMap using the Overpass API.
 * Concurrent calls were triggering API limits.
 * @param {Number} cellSize Splits query-overpass into separate requests, by splitting
 * the bounding box by the number of kilometers specified here. Example, if 200 is specified,
 * 200 by 200km bounding boxes will be created and sent to query-overpass. Any remainder will
 * be queried separately. The results from all queries are merged by feature id so that no
 * duplicates are returned.
 * @param {Object} options Options to pass to query-overpass, plus the following:
 * @param {Object} options.cellSize Size of cells to request in kilometers, defaults to 1 km
 * @param {Object} options.testBounds Used only for testing
 * @param {Array} bounds [lat_min, lon_min, lat_max, lon_max]
 *
 */
export const fetchTransitCelled = ({cellSize=1, testBounds}, bounds) => {
    const units = 'kilometers';
    // Use turf's squareGrid function to break up the bbox by cellSize squares
    const squares = R.map(
        polygon => bbox(polygon),
        squareGrid(bounds, cellSize, units).features);

    // fetchTasks :: Array (Task Object)
    const fetchTasks = R.map(fetchTransit({testBounds}), squares);
    // chainedTasks :: Array (Task Object) -> Task.chain(Task).chain(Task)...
    // We want each request to overpass to run after the previous is finished,
    // so as to not exceed the permitted request rate. Chain the tasks and reduce
    // them using map to combine all previous Task results.
    const chainedTasks = R.reduce(
        (chainedTasks, fetchTask) => chainedTasks.chain(results =>
            fetchTask.map(result =>
                R.concat(results.length ? results : [results], [result])
            )
        ),
        R.head(fetchTasks),
        R.tail(fetchTasks));

    // Fetch each square of transit and merge the results by feature id
    // concatValues combines are results sets when they return
    const concatValues = (k, l, r) => k == 'features' ? R.concat(l, r) : r;

    // sequenced :: Task (Array Object)
    //const sequenced = R.sequence(Task.of, fetchTasks);
    return chainedTasks.chain((results) =>
        Task.of(
            R.pipe(
                mergeAllWithKey(concatValues),  // combine the results into one obj with concatinated features
                R.over(                         // remove features with the same id
                    R.lens(R.prop('features'), R.assoc('features')),
                    removeDuplicateObjectsByProp('id'))
            )(results)
        )
    );
};

/***
 * fetches transit data from OpenStreetMap using the Overpass API.
 * @param {Object} options Options to pass to query-overpass, plus the following:
 * @param {Object} options.testBounds Used only for testing
 * @param {Array} bounds [lat_min, lon_min, lat_max, lon_max]
 */
export const fetchTransit = R.curry((options, bounds) => {
    const boundsAsString = R.pipe(
        list=>R.concat(
            R.reverse(R.slice(0,2)(list)),
            R.reverse(R.slice(2,4)(list))),
        R.join(',')
    )(bounds)
    const query = boundsString => `
    [out:json];
    (
        ${R.pipe(R.map(type => `
        ${type} 
            ["railway"]
            ["service" != "siding"]
            ["service" != "spur"]
            (${boundsString});
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


