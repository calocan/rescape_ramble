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

const {createDesignDoc} = require('../src/redux/cyclePouchDbStuff');
const {removeLocation, fetchLocations, persistLocations, cycleLocations} = require('./locationIO');
const { actions, actionCreators, ACTION_PATH } = require('locationActions');
const config = require('data/samples/config').default;
const {PARIS_SAMPLE, LA_SAMPLE} = require('../src/data/test/location.sample');
const {reqPath} = require('rescape-ramda').throwing;
const {mergeAllWithKey} = require('rescape-ramda');
const {concatFeatures} = require('helpers/geojsonHelpers');
const R = require('ramda');
const initialState = require('src/data/initialState').default;
const { assertSourcesSinks } = require('rescape-cycle');
const { expectTask } = require('helpers/jestHelpers');
// combine the samples into one obj with concatinated features
const geojson = mergeAllWithKey(concatFeatures)([PARIS_SAMPLE, LA_SAMPLE]);
const state = initialState(config);
const currentRegionKey = reqPath(['regions', 'currentKey'], state);
const region = reqPath(['regions', currentRegionKey], state);
const bounds = require('async/queryOverpass.sample').LA_BOUNDS;

function *letterGen(letter) {
    let index = letter.charCodeAt(0);
    while (true) {
        yield String.fromCharCode(index++);
    }
}

describe('locationHelpers', () => {
    // PouchDB.debug.enable('*');
    const path = '__db__/tests/locationHelpers.';
    // const createRemoteUrl = `http://localhost:5984/${name}`;
    // const syncObject = doSync({db, createRemoteUrl});

    test('Persist LocationList', () => {
        // Populate the db
        expectTask(
            cycleLocalDb(dbName).chain(() => persistLocations(currentRegionKey, options, geojson.features))
        ).resolves.toEqual(geojson.features);
    });

    test('Query LocationList', () => {
        const dbName = testDbName('QueryLocations');
        const options = {dbName};

        // Query the db
        expectTask(
            cycleLocalDb(dbName).chain(() => persistLocations(currentRegionKey, options, geojson.features)).chain(
                response => fetchLocations(db, options, bounds)
            ).map(response => response.rows.length)
        ).resolves.toEqual(geojson.features.length);
    });

    test('Remove Location', () => {
        const dbName = testDbName('RemoveLocations');
        const options = {dbName};

        expectTask(
            cycleLocalDb(dbName).chain(
                console.log('Persist') || persistLocations(currentRegionKey, options, geojson.features)
            )
            .chain(
                response => console.log('Fetch') || fetchLocations(currentRegionKey, {testBounds: bounds}, bounds)
            ).chain(
                response => console.log('Remove') || removeLocation(currentRegionKey, {testBounds: bounds}, R.head(response.rows))
            ).chain(
                response => console.log('Fetch') || fetchLocations(currentRegionKey, {testBounds: bounds}, bounds)
            ).map(response => R.head(response.rows))
        ).resolves.toEqual(geojson.features.length - 1);
    })

    test('should emit sink ACTION.fetchLocationsSuccess given sources ACTION.fetchLocationData and POUCHDB.query response', function(done) {
        // Fire the fetchLocations action
        const actionSource = {
            a: actionCreators.fetchLocationsData(
                currentRegionKey,
                {
                    region
                }
            ),
        };

        // Ignore the particular query parameters and return features as rows
        const pouchDbSource = {
            query: () =>
            ({
                a: {
                    rows: R.map(
                        feature => ({doc: feature}),
                        geojson.features
                    )
                }
            })
        };

        // Expect that the cycle components emits a pouchDb query in response to the action
        const actionSink = {
            x: {
                type: actions.FETCH_MARKERS_SUCCESS,
                body: geojson.features
            }
        };

        // Asserts that the sources trigger the provided sinks
        // when executing the fetchReposByUser function
        // The sources are run through main according to the source
        // diagrams. The sinks that main produces must match the sink
        // diagram provided here
        assertSourcesSinks({
            ACTION: { 'a|': actionSource },
            POUCHDB:   { 'a|': pouchDbSource }
        }, {
            // Expect this sink, the
            ACTION:   { 'x|': actionSink }
        }, cycleLocations, done);
    });

    test('should emit sink POUCHDB.update given sources ACTION.updateLocationData', function (done) {
        // Fire the fetchLocationsData action
        const actionSource = {
            a: actionCreators.updateLocationsData(
                currentRegionKey,
                {
                    region,
                    payload: geojson.features
                },
            )
        };

        const sourceGen = letterGen('b');
        const pouchDbSource = {
            // Mimic the actual driver
            // The driver simply returns the put op with given doc
            put: (doc) => ({
                a: {
                    op: 'put',
                    doc
                }
            }),
            // When we check for changes
            changes: (change) => {
                const key = sourceGen.next().value;
                // letter: {op: put, doc} for each feature
                R.fromPairs(R.map(feature =>
                [key,
                    {
                        id: feature.id,
                        changes: [ { rev: '1-9152679630cc461b9477792d93b83eae' } ],
                        doc: {
                            _id: feature.id,
                            _rev: '1-9152679630cc461b9477792d93b83eae'
                        },
                        seq: key.charCodeAt(0)
                    }
                ], geojson.features));
            }
        };


        // Ignore the particular query parameters and return features as rows
        const sinkGen = letterGen('b');
        const pouchDbSink = R.merge(
            {a: {
                    op: 'put',
                    doc: createDesignDoc(ACTION_PATH, region.id)
                }
            },
            // letter: {op: put, doc} for each feature
            R.fromPairs(R.map(doc =>
                [sinkGen.next().value,
                {
                    op: 'put',
                    doc
                }], geojson.features)
            )
        );

        // Asserts that the sources trigger the provided sinks
        // when executing the fetchReposByUser function
        // The sources are run through main according to the source
        // diagrams. The sinks that main produces must match the sink
        // diagram provided here
        assertSourcesSinks({
            ACTION: { 'a-|': actionSource },
            POUCHDB: { 'a-|': pouchDbSource }
        }, {
            // Expect the doc view and each feature to be put simulataneously
            POUCHDB: { [`(${R.keys(pouchDbSink)})|`]: pouchDbSink }
        }, cycleLocations, done);
    }, 100000);
});
