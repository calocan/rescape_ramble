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
import { from, fromPromise, combine, merge, concat } from 'most'
import {getDb} from "./pouchDbIO";
import { actions, actionCreators } from 'store/reducers/geojson/markers'
const resolveDb = (regionKey, options) => getDb(options && options.dbName || regionKey);

// Constants for naming PouchDb Views
// (Exported for testing purposes)
export const viewName = 'allMarkers'
export const designDocId = regionId => `_design/${regionId}`;
export const designDocViewId = regionId => `${regionId}/${viewName}`;
// Constants specific to markers to make the cycle more generic
const actionUpdate = actions.UPDATE_MARKERS_DATA
const actionFetch = actions.FETCH_MARKERS_DATA
const actionFetchSuccess = actions.FETCH_MARKERS_SUCCESS
const actionUpdateSuccess = actions.UPDATE_MARKERS_SUCCESS
// Ramda lens to get at properties of the marker objects
const dateLens = R.lensProp('date');
const _idLens = R.lensProp('_id');
const recordIdLens = R.lensPath(['properties', '@id']);

// PouchDb Design Doc view definition for querying
// Note that the function must be a for the POUCHDB driver
// TODO this stream should only accept each unique regionId once
const createDesignDoc = regionId => {
    return {
        _id: `${designDocId(regionId)}`,
        views: {
            [viewName]: {
                map: `function (doc) { if (doc.type === 'item') { emit(doc); } }.toString()`
            }
        }
    };
};

/*********
 * Intents
 *********/

/***
 * Filter for fetch actions to create a stream of fetch actions.
 * @param ACTION
 * @returns {{fetchAction$}}
 */
const fetchRecordIntent = ({ACTION}) => ({
    fetchAction$: ACTION
        // Respond to only actionFetch
        .filter(action => action.type === actionFetch)
        // Map to the action's region
        .map(action => action.region)
        .tap(action => console.log('Fetch records of region', action.region.id))
})

/***
 * Filter for update actions to create a stream of update actions.
 * @param ACTION
 * @returns {{fetchAction$}}
 */
const updateRecordIntent = ({ACTION}) => ({
    updateAction$: ACTION
        // Respond to only actionUpdate
        .filter(action => action.type === actionUpdate)
        // Make a stream of records to be updated
        .concatMap(action => from(action.payload))
        .tap(action => console.log('update for region', action.region.id))
})

/********
 * React Result Actions
 ********/

/***
 * Convert fetchActions to success/error result actions
 * @param fetchAction$
 * @param POUCHDB
 * @returns A fetch result stream of success/error REACT actions
 */
const fetchResultInstruction = ({fetchAction$, POUCHDB}) => ({
    // Map the region to a POUCHDB.query source for the region
    // (think of the POUCHDB source of having the whole db available, just query for what we need)
    fetchResultAction$: fetchAction$.concatMap(region => {
            return POUCHDB
                .query(designDocViewId(region.id), {
                    include_docs: true,
                    descending: true,
                })
        }
    )
    // Map the result rows to each pouchdb doc
    .map(res => {
        return actionFetchSuccess(
            res.rows.map(r => r.doc)
        )
    })
    .tap(res => console.log('pouchQueryResponse', res.rows.map(r => r.doc.id).join(', ')))
})

/***
 * Convert updateActions to a PouchDb update stream
 * @param updateAction$
 * @returns An update result stream of success/error REACT actions
 */
const updatePouchDbInstruction = ({updateAction$, POUCHDB}) => ({
    // Map all records in action[recordsName] to a POUCHDB.put stream and combine results into a stream
    updatePouchDb$: updateAction$.concatMap(record =>
        // Stream from each record
        from([record])
        // Map to {value: record, time: timestamp}
        .timestamp()
        // Add a timestamp and _id to the record to prep for database storage
        // TODO _id should only be set if it doesn't already exist (i.e. a create vs an update)
        .map(obj => {
            return R.compose(
                R.set(dateLens, obj.time),
                R.set(_idLens, obj.value.id)
            )(obj.value)
        })
        // Map the record to the POUCHDB.put stream and combine the put streams into one
        .concatMap(theRecord => {
            return POUCHDB.put(theRecord)
        })
    )
})


const updateResultInstruction = ({updatePouchDb$}) => ({
    updateResultAction$:
        // Map the resulting PouchDb rows to the Pouchdb docs
        updatePouchDb$.changes().map(res => {
            return actionFetchSuccess(
                res.rows.map(r => r.doc)
            )
        })
})

// Map an ACTION fetch source to a POUCHDB request sync
// Map a POUCHDB response source to an ACTION success/error sync
export function cycleRecords({ACTION, POUCHDB}) {

    // Input intent of user, drivers, etc into internal actions

    // Stream of fetch record intentions
    const {fetchAction$} = fetchRecordIntent({ACTION})
    // Stream of update record intentions
    const {updateAction$} = updateRecordIntent({ACTION})


    // Output instructions to drivers

    // Output a stream of PouchDB updates
    const {updatePouchDb$} = updatePouchDbInstruction({updateAction$, POUCHDB})
    // Output a stream of React fetch result actions (success/failure)
    const {fetchResultAction$} = fetchResultInstruction({fetchAction$, POUCHDB})
    // Output a stream of React update result actions (success/failure)
    const {updateResultAction$} = updateResultInstruction({updatection$})

    // Subscribe
    updateResultAction$
        .subscribe(
            rec => console.log(`Update/Create record: ${rec.id}`),
            err => {
                console.log('Rejected update', err);
            },
            () => {
                console.log('Finished update');
            }
        );

    // Create a PouchDb design doc instruction stream
    const createPouchDbDesignDoc$ = ACTION.
        filter(action => action.region).
        // Only take each region once
        distinct(action => action.region.id).
        concatMap(action => {
            return POUCHDB.put(createDesignDoc(action.region.id))
        }).tap(doc => console.log('doc', doc.id));

    // Merge the create design doc stream with the record update stream,
    // always creating the design doc for the region before doing any updates to its records
    const pouchDb$ = createPouchDbDesignDoc$
        .merge(updatePouchDb$)
        .tap(doc => console.log('doc', doc.id));

    const resultAction$ = fetchResultAction$.merge(updateResultAction$);

    return {
        ACTION: resultAction$,
        POUCHDB: pouchDb$
    }
}



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