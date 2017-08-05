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
import { cycleRecords } from './cycleHelpers'
import {getDb} from './pouchDbIO';
import { actions, actionCreators, actionPath } from 'store/reducers/geojson/markerActions'
const resolveDb = (regionKey, options) => getDb(options && options.dbName || regionKey);


// Constants specific to markers to make the cycle more generic
const actionUpdateName = actions.UPDATE_MARKERS_DATA
const actionFetchName = actions.FETCH_MARKERS_DATA
const actionFetchSuccess = actionCreators.FETCH_MARKERS_SUCCESS
const actionUpdateSuccess = actionCreators.UPDATE_MARKERS_SUCCESS
const actionFetchFailure = actionCreators.FETCH_MARKERS_FAILURE
const actionUpdateFailure = actionCreators.UPDATE_MARKERS_FAILURE

/***
 * A cycle.js component that processes async Marker sources/sinks
 */
export const cycleMarkers = sources => cycleRecords({
    // ACTION_CONFIG configures the generic cycleRecords to call/match the correct actions
    ACTION_CONFIG: {
        actionPath,
        actionFetchName,
        actionUpdateName,
        actionFetchSuccess,
        actionUpdateSuccess,
        actionFetchFailure,
        actionUpdateFailure
    },
    ...sources
})

/***
 * fetches transit data from OpenStreetMap using the Overpass API.
 * @param {String} The key of the region, used for database scope
 * @param {Object} options Currently unused. Options to pass to query-overpass, plus the following
 * @param {Object} options.testBounds Used only for testing
 * @param {Array} options.bounds Currently unusued [lat_min, lon_min, lat_max, lon_max]
 */
export const fetchMarkers = (regionKey, options) => {
    return new Task(function(reject, resolve) {
        const db = resolveDb(regionKey, options)
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
        const db = resolveDb(regionKey, options)
        // Get all markers or just those specified
        db.allDocs(markers ? { keys: R.map(R.prop('id'), markers) } : {}).then(function (result) {
            // Promise isn't supported by all browsers; you may want to use bluebird
            return Promise.all(result.rows.map(function (row) {
                console.log(`Deleting ${row.id}`);
                return db.remove(row.id, row.value.rev);
            }));
        }).then(function () {
            resolve(db);
        }).catch(function (err) {
            reject(err);
        });
    }).chain(db => fetchMarkers(db, options, null))
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
 * @param {Object} options.dbName Optional name for the database for testing. Defaults to regionKey
 * @param {Array} features Geojson features
 * @returns {Task} A Task that when forked executes the persistence
 */
export const persistMarkers = (regionKey, options, features) => {
    /*
    const dateLens = R.lensProp('date');
    const _idLens = R.lensProp('_id');
    const featureIdLens = R.lensPath(['properties', '@id']);
    return new Task(function(reject, resolve) {
        const db = resolveDb(regionKey, options)

        // Function that writes features to document store
        const writeFeature$ = feature => from([feature])
            .timestamp()
            .tap(val => console.log('writeFeature', feature.id))
            // Add a timestamp and _id to the feature for storing
            .map(obj => R.compose(R.set(dateLens, obj.time), R.set(_idLens, obj.value.id))(obj.value))
            .tap(theFeature => console.log(`Add/Update feature for: ${R.view(featureIdLens, theFeature)}`))
            .mergeMap(datedFeature => fromPromise(
                db.put(datedFeature)
            ));

        // Run through all Features in the array
        from(features)
            .concatMap(writeFeature$) // Map each Feature to writeFeatures$, and concat the resultant single item stream
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
    */
};
