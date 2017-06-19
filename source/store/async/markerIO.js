/**
 * Created by Andy Likuski on 2017.04.03
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Task from 'data.task';
import R from 'ramda';
import Rx from 'rxjs';
import squareGrid from '@turf/square-grid';
import bbox from '@turf/bbox';
import {mergeAllWithKey, removeDuplicateObjectsByProp} from 'helpers/functions';
import {getDb} from "./pouchDb";

/***
 * fetches transit data from OpenStreetMap using the Overpass API.
 * @param {String} The key of the region, used for database scope
 * @param {Object} options Currently unused. Options to pass to query-overpass, plus the following
 * @param {Object} options.testBounds Used only for testing
 * @param {Array} bounds Currently unusued [lat_min, lon_min, lat_max, lon_max]
 */
export const fetchMarkers = (regionKey, options, bounds) => {
    return new Task(function(reject, resolve) {
        const db = getDb(regionKey)
        console.log('Fetching records')
        db.allDocs({include_docs: true, descending: true}, function(err, doc) {
            if (!err) {
                console.log('Fetched')
                resolve(doc);
            }
            else {
                console.error('Fetch failed')
                reject(err);
            }
        })
    });
};

/***
 * Removes the given markers or all markers if markers is null
 * @param {String} regionKey
 * @param options
 * @param markers
 * @returns {*|Task}
 */
export const removeMarkers = (regionKey, options, markers) => {
    return new Task((reject, resolve) => {
        const db = getDb(regionKey)
        // Get all markers or just those specified
        db.allDocs(markers ? { keys: R.map(R.prop('id'), markers) } : {}).then(function (result) {
            // Promise isn't supported by all browsers; you may want to use bluebird
            return Promise.all(result.rows.map(function (row) {
                console.log(`Deleting ${row.id}`);
                return db.remove(row.id, row.value.rev);
            }));
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    }).chain(() => fetchMarkers(db, options, null))
}

/***
 * Remove the given marker
 * @param {String} regionKey
 * @param options Reserved for future use
 * @param marker Geojson feature representing the marker to delete
 */
export function removeMarker(regionKey, options, marker) {
    removeMarkers(regionKey, options, [marker])
}

/***
 * Persists a list of features that represent markers
 * @param {String} regionKey
 * @param {Object} options Currently unused, reserved for future use
 * @param {Array} features Geojson features
 * @returns {Task} A Task that when forked executes the persistence
 */
export const persistMarkers = (regionKey, options, features) => {
    const dateLens = R.lensProp('date');
    const _idLens = R.lensProp('_id');
    const featureIdLens = R.lensPath(['properties', '@id']);
    return new Task(function(reject, resolve) {
        const db = getDb(regionKey)
        // Function that writes features to document store
        const writeFeature$ = feature => Rx.Observable.of(feature)
            .timestamp()
            // Add a timestamp and _id to the feature for storing
            .map(obj => R.compose(R.set(dateLens, obj.timestamp), R.set(_idLens, obj.value.id))(obj.value))
            .do(theFeature => console.log(`Add/Update feature for: ${R.view(featureIdLens, theFeature)}`))
            .mergeMap(datedFeature => Rx.Observable.fromPromise(
                db.put(datedFeature)
            ));

        // Run through all Features in the array
        Rx.Observable.from(features)
            .concatMap(writeFeature$) // Map the writeFeatures$ to each Feature object
            .subscribe(
                rec => console.log(`New record created: ${rec.id}`),
                err => {
                    console.log('Rejected features')
                    reject(err)
                },
                () => {
                    console.log('Finished updating features')
                    resolve(features);
                }
            );
    }).chain(() => fetchMarkers(regionKey, options, null))
};

/***
 * fetches transit data in squares sequentially from OpenStreetMap using the Overpass API.
 * Concurrent calls were triggering API limits.
 * @param {Number} cellSize Splits query-overpass into separate requests, by splitting
 * the bounding box by the number of kilometers specified here. Example, if 200 is specified,
 * 200 by 200km bounding boxes will be created and sent to query-overpass. Any remainder will
 * be queried separately. The results from all queries are merged by feature id so that no
 * duplicates are returned.
 * @param {Object} options Options to pass to query-overpass, plus the following:
 * @param {Number} options.cellSize Size of cells to request in kilometers, defaults to 1 km
 * @param {Number} options.sleepBetweenCalls Pause this many milliseconds between calls to avoid the request rate limit
 * @param {Object} options.testBounds Used only for testing
 * @param {Array} bounds [lat_min, lon_min, lat_max, lon_max]
 *
 */
export const fetchMarkersCelled = (regionKey, {name, cellSize = 1, sleepBetweenCalls, testBounds}, bounds) => {
    const units = 'kilometers';
    // Use turf's squareGrid function to break up the bbox by cellSize squares
    const squares = R.map(
        polygon => bbox(polygon),
        squareGrid(bounds, cellSize, units).features);

    // fetchTasks :: Array (Task Object)
    const fetchTasks = R.map(fetchMarkers(regionKey, {name, sleepBetweenCalls, testBounds}), squares);
    // chainedTasks :: Array (Task Object) -> Task.chain(Task).chain(Task)...
    // We want each request to overpass to run after the previous is finished,
    // so as to not exceed the permitted request rate. Chain the tasks and reduce
    // them using map to combine all previous Task results.
    const chainedTasks = R.reduce(
        (chained, fetchTask) => chained.chain(results =>
            fetchTask.map(result =>
                R.concat(results.length ? results : [results], [result])
            )
        ),
        R.head(fetchTasks),
        R.tail(fetchTasks));

    // Fetch each square of transit and merge the results by feature id
    // concatValues combines are results sets when they return
    const concatValues = (k, l, r) => k === 'features' ? R.concat(l, r) : r;

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

