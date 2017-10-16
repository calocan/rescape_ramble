/**
 * Created by Andy Likuski on 2017.07.31
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const R = require('ramda');

// Ramda lens to get at properties of the marker objects
const dateLens = R.lensProp('date');
const _idLens = R.lensProp('_id');
// Constants for naming PouchDb Views
const designDocId = regionId => `_design/${regionId}`;
const designDocViewId = (actionPath, regionId) => `${actionPath}/${regionId}`;

// PouchDb Design Doc view definition for querying
// Note that the function must be a for the POUCHDB driver
// (Exported for testing purposes)
// TODO this stream should only accept each unique regionId once
const createDesignDoc = module.exports.createDesignDoc = (actionPath, regionId) => {
    return {
        _id: `${designDocId(regionId)}`,
        views: {
            [actionPath]: {
                map: 'function (doc) { if (doc.type === \'item\') { emit(doc); } }.toString()'
            }
        }
    };
};

/**
 * React Result Actions
 ********/

/**
 * Convert updateActions to a PouchDb update stream
 * @param {Stream} updateAction$ A stream configured to perform a configured update action for a Region
 * @returns {Stream} An update result stream of success/error REACT actions
 */
const updatePouchDbInstruction = ({updateAction$, POUCHDB}) =>
    // Map all records in action[recordsName] to a POUCHDB.put stream and combine results into a stream
    updateAction$.concatMap(record =>
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
                )(obj.value);
            })
            // Map the record to the POUCHDB.put stream and combine the put streams into one
            .concatMap(theRecord => {
                return POUCHDB.put(theRecord);
            })
    );

/**
 * Combines Redux ACTION Driver with Pouch ACTION Driver to perform CRUD operations
 * against a PouchDb.
 * @param {Object} ACTION_CONFIG Configuration of actions to match in the following format:
 * @param {String} ACTION_CONFIG.actionPath 'scope/actionKey' Used to name the PouchDb Design Doc
 * @param {String} ACTION_CONFIG.actionUpdateName React Action name to perform updates
 * @param {String} ACTION_CONFIG.actionFetchName React Action name to perform fetches
 * @param {Function} ACTION_CONFIG.actionFetchSuccess React Action creator for a successful fetch
 * @param {Function} ACTION_CONFIG.actionUpdateSuccess React Action creator for a successful update
 * @param {Function} ACTION_CONFIG.actionFetchFailure React Action creator for a failed fetch
 * @param {Function} ACTION_CONFIG.actionUpdateFailure React Action creator for a failed update
 * @param {Object} ACTION The React Action driver source
 * @param {Object} POUCHDB The PouchDb driver source
 * @returns {Object} The cycle.js sink containing ACTION and POUCHDB sinks
 */
module.exports.cycleRecords = function cycleRecords({ACTION_CONFIG, ACTION, POUCHDB}) {
    // Input intent of user, drivers, etc into internal actions

    // Stream of fetch record intentions
    const fetchAction$ = fetchRecordIntent({ACTION_CONFIG, ACTION});
    // Stream of update record intentions
    const updateAction$ = updateRecordIntent({ACTION_CONFIG, ACTION});


    // Output instructions to drivers

    // Output a stream of PouchDB updates
    const updatePouchDb$ = updatePouchDbInstruction({updateAction$, POUCHDB});
    // Output a stream of React fetch result actions (success/failure)
    const fetchResultAction$ = fetchResultInstruction({fetchAction$, ACTION_CONFIG, POUCHDB});
    // Output a stream of React update result actions (success/failure)
    const updateResultAction$ = updateResultInstruction({ACTION_CONFIG, POUCHDB});

    // Subscribe
    updateResultAction$
        .subscribe(
            rec => {
                // console.log(`Update/Create record: ${rec.id}`);
            },
            err => {
                // console.log('Rejected update', err);
            },
            () => {
                // console.log('Finished update');
            }
        );

    // Create a PouchDb design doc instruction stream
    const pouchDbDesignDoc$ = ACTION.filter(action => action.region);
    // Only take each region once. Use Rx js since Most doesn't seem
    // to support a distinct function
    const distinctDesignDoc$ = Rx.Observable.from(pouchDbDesignDoc$).
        distinct(action => action.region.id);

    const createPouchDbDesignDoc$ = from(distinctDesignDoc$)
        .concatMap(action => {
            return POUCHDB.put(createDesignDoc(ACTION_CONFIG.actionPath, action.region.id));
        });
        // .tap(doc => console.log('doc', doc.id));

    // Merge the create design doc stream with the record update stream,
    // always creating the design doc for the region before doing any updates to its records
    const pouchDb$ = createPouchDbDesignDoc$
        .merge(updatePouchDb$);
        // .tap(doc => console.log('doc', doc.id));

    const resultAction$ = fetchResultAction$.merge(updateResultAction$);

    return {
        ACTION: resultAction$,
        POUCHDB: pouchDb$
    };
};
