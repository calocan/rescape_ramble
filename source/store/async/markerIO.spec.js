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

import {removeMarker, fetchMarkers, persistMarkers, cycleMarkers, viewName, designDocId, designDocViewId} from './markerIO';
import config from 'store/data/test/config';
import {PARIS_SAMPLE, LA_SAMPLE} from './markerIO.sample'
import {reqPath} from 'helpers/throwingFunctions'
import {mergeAllWithKey} from 'helpers/functions'
import {concatFeatures} from 'helpers/geojsonHelpers'
import R from 'ramda'
import initialState from "store/data/initialState";
import { assertSourcesSinks } from './jestCycleHelpers'
import { actions, actionCreators } from 'store/reducers/geojson/markerActions'

// combine the samples into one obj with concatinated features
const geojson = mergeAllWithKey(concatFeatures)([PARIS_SAMPLE, LA_SAMPLE]);
const state = initialState(config);
const currentRegionKey = reqPath(['regions', 'currentKey'], state);
const region = reqPath(['regions', currentRegionKey], state);
const testDbName = name => `${__dirname}/__databases__/${name}`
const bounds = require('query-overpass').LA_BOUNDS;

function* letterGen (letter) {
    let index = letter.charCodeAt(0)
    while (true) {
        yield String.fromCharCode(index++);
    }
}

describe('markerHelpers', () => {

    //PouchDB.debug.enable('*');
    const path = '__db__/tests/markerHelpers.';
    // const createRemoteUrl = `http://localhost:5984/${name}`;
    // const syncObject = sync({db, createRemoteUrl});

    /*
    test('Persist MarkerList', () => {
        const dbName = testDbName('PersistMarkers');

        const options = {dbName};

        // Populate the db
        expectTask(
            cycleLocalDb(dbName).chain(() => persistMarkers(currentRegionKey, options, geojson.features))
        ).resolves.toEqual(geojson.features);
    });

    test('Query MarkerList', () => {
        const dbName = testDbName('QueryMarkers');
        const options = {dbName};

        // Query the db
        expectTask(
            cycleLocalDb(dbName).chain(() => persistMarkers(currentRegionKey, options, geojson.features)).chain(
                response => fetchMarkers(db, options, bounds)
            ).map(response => response.rows.length)
        ).resolves.toEqual(geojson.features.length);
    });

    test('Remove Marker', () => {
        const dbName = testDbName('RemoveMarkers');
        const options = {dbName};

        expectTask(
            cycleLocalDb(dbName).chain(
                console.log('Persist') || persistMarkers(currentRegionKey, options, geojson.features)
            )
            .chain(
                response => console.log('Fetch') || fetchMarkers(currentRegionKey, {testBounds: bounds}, bounds)
            ).chain(
                response => console.log('Remove') || removeMarker(currentRegionKey, {testBounds: bounds}, R.head(response.rows))
            ).chain(
                response => console.log('Fetch') || fetchMarkers(currentRegionKey, {testBounds: bounds}, bounds)
            ).map(response => R.head(response.rows))
        ).resolves.toEqual(geojson.features.length - 1);
    })

    test('should emit sink ACTION.fetchMarkersSuccess given sources ACTION.fetchMarkerData and POUCHDB.query response', function(done) {
        // Fire the fetchMarkers action
        const actionSource = {
            a: actionCreators.fetchMarkersData(
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
        }, cycleMarkers, done);
    });
    */

    test('should emit sink POUCHDB.update given sources ACTION.updateMarkerData', function(done) {
        // Fire the fetchMarkersData action
        const actionSource = {
            a: actionCreators.updateMarkersData(
                currentRegionKey,
                {
                    region,
                    payload: geojson.features
                },
            ),
        };

        const pouchDbSource = {
            // Mimic the actual driver
            put: (doc) =>
                ({
                    a: {
                        op: 'put',
                        doc
                    }
                })
        };


        // Ignore the particular query parameters and return features as rows
        const gen = letterGen('b')
        const pouchDbSink = R.merge(
            {a: {
                    op: 'put',
                    doc: {
                        _id: designDocId(region.id),
                        views: {
                            [viewName]: {
                                map: `function (doc) { if (doc.type === 'item') { emit(doc); } }.toString()`
                            }
                        }
                    }
                }
            },
            // letter: {op: put, doc} for each feature
            R.fromPairs(R.map(doc =>
                [gen.next().value,
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
            POUCHDB:   { '-|': pouchDbSource }
        }, {
            // Expect the view and each feature to be put
            POUCHDB:   { [`${R.keys(pouchDbSink)}|`]: pouchDbSink }
        }, cycleMarkers, done);
    }, 10000);
});
