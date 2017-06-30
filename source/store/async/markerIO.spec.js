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

import {removeMarker, fetchMarkers, persistMarkers, cycleMarkers} from './markerIO';
import {cycleLocalDb} from './pouchDbIO'
import config from 'store/data/test/config';
import {expectTask} from 'helpers/jestHelpers'
import {PARIS_SAMPLE, LA_SAMPLE} from './markerIO.sample'
import {getRequiredPath, mergeAllWithKey} from 'helpers/functions'
import {concatFeatures} from 'helpers/geojsonHelpers'
import R from 'ramda'
import initialState from "store/data/initialState";

import { assertSourcesSinks } from './jestCycleHelpers'
import { SCOPE, ACTION_NAME, actions, actionCreators } from 'store/reducers/geojson/markerActions'

// combine the samples into one obj with concatinated features
const geojson = mergeAllWithKey(concatFeatures)([PARIS_SAMPLE, LA_SAMPLE]);
const state = initialState(config);
const currentRegionKey = getRequiredPath(['regions', 'currentKey'], state);
const region = getRequiredPath(['state', currentRegionKey], state);
const testDbName = name => `${__dirname}/__databases__/${name}`

describe('markerHelpers', () => {

    //PouchDB.debug.enable('*');
    const bounds = require('query-overpass').LA_BOUNDS;
    const path = '__db__/tests/markerHelpers.';
    // const createRemoteUrl = `http://localhost:5984/${name}`;
    // const syncObject = sync({db, createRemoteUrl});

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

    test('cycleMarkers emits pouchDb query given ACTION', function(done) {
        const actionSource = {
            a: actions.fetchMarkers(currentRegionKey, {}, region.geospatial.bounds),
        };

        const pouchDbSource = {
            query: () => null
        };

        const pouchDbSink = {
            x: {
                url: `https://api.github.com/users/${user1}/repos`,
                category: 'users'
            },
        };

        // Asserts that the sources, trigger the provided sinks,
        // when executing the fetchReposByUser function
        assertSourcesSinks({
            ACTION: { 'a|': actionSource },
            POUCHDB:   { '-|': pouchDbSource }
        }, {
            POUCHDB:   { 'x|': pouchDbSink }
        }, cycleMarkers, done);
    });
});
